import tiktoken
from langchain_text_splitters import TokenTextSplitter
import datetime
import json
import os
import autogen
# from openai.error import RateLimitError
from typing_extensions import Annotated
from pathlib import Path
import re
from typing import Tuple

default_path = os.getcwd().replace("\\", "/")+"/my-app/"
base_path = os.getcwd().replace("\\", "/")+"/my-app/"
src_path = os.path.join(os.getcwd(), "my-app/src").replace("\\", "/")


language = "nextjs"  # update this to the language you are working with

config_list = [
    {
        "model": "gpt-4",
        "api_key": "ec3ea9ddf28c4c259934fb7c9e6ffd9d",
        "api_type": "azure",
        "api_version": "2024-08-01-preview",
        "azure_endpoint": "https://copilot-chatbot.openai.azure.com/",
    }
]

llm_config = {
    "temperature": 0,
    "config_list": config_list,
}

user_proxy = autogen.UserProxyAgent(
    name="admin",
    human_input_mode="NEVER",
    code_execution_config={
        "use_docker": False,
    },
    is_termination_msg=lambda x: x.get("content", "")
    and x.get("content", "").rstrip().endswith("TERMINATE"),
    max_consecutive_auto_reply=5,
    system_message="""Understand and analyze all the code. Do not run the code.
    If any bug or inefficient code is found, fix it. Without changing the functionality of the code:
    1. Improve code quality.
    2. Follow Next.js conventions and best practices.
    3. Ensure the latest state of the file before making changes.
    4. If the `rerank` function or any core function is involved, **do not remove or alter its logic**.
    5. Always consult with the senior developer before modifying core functionality.
    6. Provide clear, step-by-step instructions for the developer agent if any changes are needed.
    """,
)

nextjs_developer = autogen.AssistantAgent(
    name="nextjs_developer",
    llm_config=llm_config,
    system_message="""I'm a Next.js developer. I can:
    1. Analyze Next.js code, including components, API routes, and pages.
    2. Fix code errors and optimize Next.js-specific features.
    3. Ensure proper use of `getStaticProps`, `getServerSideProps`, `useEffect`, and `useState`.
    4. Follow React and Next.js conventions for folder structure and dynamic routing.
    
    Guidelines:
    1. **Do not run the code.**
    2. **Do not remove any core functions** unless explicitly instructed.
    3. **Maintain original behavior** when modifying code, unless optimization or error handling is required.
       - Ensure proper use of Next.js features like `Link`, `Head`, and API routes.
    4. Add comments explaining any updates made to the code.
    5. Ensure all components are functional and stateless where possible, with clear PropTypes or TypeScript interfaces.
    """,
)

senior_developer = autogen.AssistantAgent(
    name="senior_developer",
    llm_config=llm_config,
    system_message="""I'm a senior Next.js developer. I guide the development process by:
    1. Reviewing Next.js-specific code changes.
    2. Ensuring proper use of React and Next.js patterns.
    3. Checking for dynamic routing, SSR/SSG usage, and API route correctness.
    4. Providing feedback on code quality and adherence to conventions.
    """,
)

groupchat = autogen.GroupChat(
    agents=[user_proxy, nextjs_developer, senior_developer],
    messages=[],
    max_round=120,
    speaker_selection_method="round_robin",
)

manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)


def ignore_files(starts_with: list, ends_with: list, files: list):
    for start in starts_with:
        files = [f for f in files if not f.startswith(start)]
    for end in ends_with:
        files = [f for f in files if not f.endswith(end)]
    return files


def format_based_on_language(language: str):
    if language.lower() == "python":
        return [".py"]
    elif language.lower() == "javascript":
        return [".js"]
    elif language.lower() == "java":
        return [".java"]
    elif language.lower() == "nextjs":
        return [".js", ".jsx", ".ts", ".tsx"]
    elif language.lower() == "reactjs":
        return [".js", ".jsx"]
    elif language.lower() == "typescript":
        return [".ts", ".tsx"]
    else:
        raise ValueError("Invalid language specified.")


def list_dir_recursive(directory: str, language: str = "nextjs"):
    """Recursively process files and subdirectories."""
    try:
        items = os.listdir(directory)
        
        items = ignore_files([".","__pycache__","node_modules"], [".ipynb", ".pyc"], items)
        items = [os.path.join(directory, item).replace("\\", "/") for item in items]


        for item in items:
            if os.path.isdir(item):
                items += list_dir_recursive(
                    item
                )

        items = [
            item
            for item in items
            if item.endswith(tuple(format_based_on_language(language)))
        ]

        return list(set(items))
    except Exception as e:
        print(f"Error: {str(e)}")


@user_proxy.register_for_execution()
@nextjs_developer.register_for_llm(
    description="List and process valid code files in the directory recursively."
)
def list_dir(
    directory: Annotated[str, "Directory to check."],
    language: Annotated[str, "Programming language"],
):
    """
    Lists valid code files in the given directory recursively, while:
    - Ignoring specific files (e.g., those starting with `.` or ending with `.ipynb`).
    - Filtering files based on valid extensions for the chosen programming language.
    """
    print(f"Listing files in directory: {directory} with language: {language}")
    try:
        directory = Path(default_path)
        print("directory coming in list_dir", directory)
        files = list_dir_recursive(directory, language)

        print("Total files found:", len(files))
        return 0, files
    except Exception as e:
        return 1, f"Error: {str(e)}"


@user_proxy.register_for_execution()
@nextjs_developer.register_for_llm(description="Check the contents of a chosen file.")
def see_file(filepath: Annotated[str, "Name and path of file to check."]):
    print("Reading file:", filepath)
    with open(filepath, "r") as file:
        lines = file.readlines()
    formatted_lines = [f"{i+1}:{line}" for i, line in enumerate(lines)]
    return 0, "".join(formatted_lines)


@user_proxy.register_for_execution()
@nextjs_developer.register_for_llm(
    description="Replace the content of a file with new code."
)
def modify_file(
    filepath: Annotated[str, "Name and path of file to change."],
    new_code: Annotated[str, "New content for the file."],
):
    print("Modifying file:", filepath)
    with open(filepath, "w") as file:
        file.write(new_code)
    return 0, "File content updated successfully."

@user_proxy.register_for_execution()
@nextjs_developer.register_for_llm(description="Replace the content of a file with new code.")
def modify_file_by_replacing(
    filepath: Annotated[str, "Name and path of file to change."],
    old_code: Annotated[str, "Old content to replace."],
    new_code: Annotated[str, "New content to replace the old one."],
):
    print("Modifying file with replacement:", filepath)
    with open(filepath, "r") as file:
        content = file.read()
    content = content.replace(old_code, new_code)
    with open(filepath, "w") as file:
        file.write(content)
    return 0, "File content updated successfully."

@user_proxy.register_for_execution()
@nextjs_developer.register_for_llm(description="Store an issue and errors.")
def store_issue(issue: Annotated[str, "Issue to store."]) -> Tuple[int, str]:
    global issues
    issues = issue
    print("Stored issues:", issues)
    return 0, "Issues stored successfully"

@user_proxy.register_for_execution()
@nextjs_developer.register_for_llm(description="Run npm or npx commands.")
def run_npm_command(
    file_path: Annotated[str, "File path to process"],
    command: Annotated[str, "npm/npx command to run"]
) -> Tuple[int, str]:
    import subprocess

    try:
        # Construct the command
        if command.startswith("npx "):
            cmd = f"npx eslint {file_path} --ext .ts,.tsx --fix"
        else:
            cmd = f"npm {command}"

        print(f"Running command: {cmd}")
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True, cwd=default_path
        )

        # Prepare command output
        command_output = (
            f"Command: {cmd}\n\nOutput:\n{result.stdout}\n\nErrors:\n{result.stderr}"
        )
        print(command_output)

        # Check ESLint output for problems
        if "eslint" in command or "eslint" in result.stdout.lower():

            if "problem" in result.stdout.lower():
                # ESLint detected issues, store them and return failure
                store_issue(command_output)
                return 1, result.stdout.strip() or "ESLint detected issues."

            # No problems detected
            return 0, "ESLint completed successfully with no issues."
        
        # Handle the regular build command
        if "npm run build" in command or "build" in result.stdout.lower():

            if result.stderr.lower():  # Check if there are any errors
                store_issue(command_output)
                return 1, result.stderr.strip() or "Build failed due to ESLint issues or warnings."
            else:
                # If no issues, return success
                return 0, "Build completed successfully with no issues."

        # # General npm/npx command: return status and output
        # return (0 if result.returncode == 0 else 1), command_output

    except Exception as e:
        # Handle exceptions during command execution
        error_msg = f"Command: {cmd}\n\nError:\n{str(e)}"
        print(error_msg)
        return 1, error_msg

@user_proxy.register_for_execution()
@nextjs_developer.register_for_llm(description="Create a new file with code.")
def create_file_with_code(
    filepath: Annotated[str, "Name and path of file to create."],
    code: Annotated[str, "Code to write in the file."],
):
    with open(filepath, "w") as file:
        file.write(code)
    return 0, "File created successfully."


@user_proxy.register_for_execution()
@nextjs_developer.register_for_llm(description="Run the code and return the output.")
def run_code(filepath: Annotated[str, "Name and path of file to run."]):
    try:
        with open(filepath, "r") as file:
            code = file.read()
        exec(code)
        return 0, "Code executed successfully."
    except Exception as e:
        return 1, str(e)


@user_proxy.register_for_execution()
@senior_developer.register_for_llm(
    description="Store code review feedback in a log file."
)
def store_code_review(
    filepath: Annotated[str, "Path of the file being reviewed."],
    review_feedback: Annotated[str, "Senior developer's review feedback."],
    timestamp: Annotated[str, "Timestamp of the review."] = None,
):
    """
    Stores code review feedback in a structured format within a log file.
    Creates a 'code_reviews' directory if it doesn't exist.
    """
    # Create code_reviews directory if it doesn't exist
    reviews_dir = "code_reviews"
    os.makedirs(reviews_dir, exist_ok=True)

    # Generate timestamp if not provided
    if timestamp is None:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Create review entry
    review_entry = {
        "file_reviewed": filepath,
        "timestamp": timestamp,
        "feedback": review_feedback,
    }

    # Create or append to the review log file
    review_log_path = os.path.join(reviews_dir, "code_review_log.jsonl")

    try:
        with open(review_log_path, "a") as f:
            f.write(json.dumps(review_entry) + "\n")
        return 0, f"Review stored successfully in {review_log_path}"
    except Exception as e:
        return 1, f"Error storing review: {str(e)}"

# Initialize the logged group chat
groupchat = autogen.GroupChat(
    agents=[user_proxy, nextjs_developer, senior_developer],
    messages=[],
)

manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)


def process_eslint_issues():
    print("Processing ESLint issues...")

    # Get list of files
    status, files = list_dir(default_path, language)

    if status == 0 and files:
        for file_path in files:
            print(f"Checking {file_path} for issues...")

            # this while loop run until there are no issues, status = 0 where 0 means no issues found then break
            while True:
                status, issues = run_npm_command(file_path, "npx eslint . --ext .ts,.tsx --fix")
                print(f"Status: {status}, Issues: {issues}")

                if status == 0:
                    print(f"No issues found in {file_path}. Proceeding to next file.")
                    break

                print(f"Passing {file_path} to resolve eslint issues...")
                # try:
                user_proxy.initiate_chat(
                        manager,
                        message=f"""
                            @javascript_developer and @senior_developer, please process the following file: {file_path}

                            **Issue:**
                            {issues}

                            **Instructions:** 
                            1. **@javascript_developer:**
                            - Read and analyze the file content to read file content use the `see_file` function.
                            - Read the error log and share it with @senior_developer.
                            - Share the file content and your initial analysis with @senior_developer.
                            - Wait for feedback and instructions from @senior_developer before proceeding.
                            - When implementing changes:
                                * Modify the code strictly based on @senior_developer's feedback and examples.
                                * Update functions or components only as needed. Mark unused code with comments (`// UNUSED`) instead of removing it unless explicitly instructed otherwise.
                                * Add or update **JSDoc comments** for all functions or components, ensuring clear and concise descriptions based on the component's purpose and @senior_developer's suggestions.
                                * Keep the original functionality intact unless the feedback specifies changes.
                                * Add inline comments explaining any updates or changes you make.
                            - Share the modified file back with @senior_developer for review.

                            2. **@senior_developer:**
                            - Analyze the provided file and @javascript_developer's initial analysis.
                            - Provide detailed feedback with clear instructions on:
                                * Code improvements or fixes required.
                                * Adding or refining JSDoc comments.
                                * Structural or stylistic changes following Next.js and JavaScript best practices.
                            - Include specific code examples wherever applicable to demonstrate improvements.
                            - After reviewing the changes implemented by @javascript_developer:
                                * Write a **comprehensive code review** summarizing the changes made and how they align with Next.js best practices. For example:
                                    - JSDoc comments added or updated.
                                    - Error handling improvements.
                                    - Component structure or styling adjustments.
                                * Provide a code snippet of the updated file in the review for reference. Also, save the review feedback using the `store_code_review` function.
                                * End the review with "TERMINATE" to indicate final approval and completion of the process.

                            Note:
                            - if there is large content as input which you cannot able to process then call `process_large_file` function it will process file in chunks.

                            **Additional Guidelines:**
                            - Minimize unnecessary back-and-forth communication; provide comprehensive instructions in each step.
                            - Focus on improving code quality, readability, and documentation. Avoid performance optimizations unless explicitly required.

                            **Process Flow:**
                            1. @javascript_developer reads and shares the file with @senior_developer.
                            2. @senior_developer analyzes and provides actionable feedback with examples.
                            3. @javascript_developer implements changes based on feedback.
                            4. @senior_developer reviews and verifies the updates and saves the review feedback using the `store_code_review` function.
                            5. @senior_developer writes a **detailed code review** summarizing:
                                - Changes made.
                                - Improvements achieved.
                                - Any remaining suggestions or observations (if any).
                            6. @senior_developer provides the final updated code snippet and ends the process by saying "TERMINATE". 

                            Please begin the code review process.
                            """
                    )
                print(f"Rechecking eslint issues in {file_path} after proxy resolution...")

        print("All files processed successfully.")
    else:
        print(f"Error listing files: {files}" if status == 1 else "No files found to process.")

    print("Trying to build project...")

    while True:
        # Attempt to build the project
        status, build_output_error = run_npm_command(base_path, "run build")

        if status == 0:
            print("Build successful!")
            break
        else:
            print("\nBuild failed. Passing error to agent for debugging.")
            
            # Extract the file path from the build_output using regex
            file_pattern = r"^(?:\.{0,2}/)?[\w./\[\]-]+\.(?:ts|tsx|json|css)(?::\d+:\d+)?"
            message_pattern = r"^(?:(\d+:\d+)\s+)?(Warning|Error|Type error):\s+(.*)"

            # Initialize variables
            error_map = {}
            current_file = None

            # Process the log line by line
            for line in build_output_error.splitlines():
                # Match file path
                file_match = re.match(file_pattern, line)
                if file_match:
                    file_path = file_match.group().split(":")[0]  # Get the file path, remove line number if present

                    # Adjust paths
                    if file_path.startswith('.next'):
                        # Adjust .next path
                        path_parts = file_path.split('/')
                        modified_path = '/'.join(path_parts[-4:])
                        final_path = f"{src_path}/{modified_path}"
                        final_path = final_path.replace('.ts', '.tsx')
                    elif file_path.startswith('./src'):
                        # Adjust ./src path
                        final_path = f"{default_path}{file_path}"
                        final_path = final_path.replace("./", "")
                    else:
                        # Unrecognized path; keep as is
                        final_path = file_path

                    current_file = final_path  # Set the current file
                    if current_file not in error_map:
                        error_map[current_file] = []  # Initialize error list for the file
                elif current_file:
                    # Match error/warning messages
                    message_match = re.match(message_pattern, line.strip())
                    if message_match:
                        line_col, severity, message = message_match.groups()
                        error_map[current_file].append({
                            "line_col": line_col if line_col else "N/A",
                            "severity": severity,
                            "message": message
                        })

            # Output the structured data
            for file, errors in error_map.items():
                print(f"File Path: {file}")
                print(f'error:{errors}')
    

                user_proxy.initiate_chat(
                manager,
                message=f"""
            **Build Failed during `npm run build`:**

            @javascript_developer and @senior_developer, please process the following file: {file}

            **Issue:**
            {errors}

            **When the Error Occurs:**
            -The error occurs when the params property in your component is defined as a Promise (e.g., Promise<{{ id: string }}>) while TypeScript expects params to be an immediately available object (e.g., {{ id: string }}). This typically happens in React Server Components or Next.js dynamic routes where params is asynchronous.
            -In this case, params is a Promise that needs to be resolved before accessing the id property. However, TypeScript and React expect params to be resolved synchronously during the rendering process. Since params is a Promise, React or Next.js cannot handle it properly when rendering the component, which leads to errors when trying to access params.id during the render.

                for example:
                ```
                interface PageProps {{params: Promise<{{id: string;}}>;}}```

            **Solution:**
            
            To fix this issue, you need to use React's use hook (introduced in React 18 for Server Components). The use hook allows you to directly resolve the params promise inside the component. By using the use hook, React can resolve the promise during server-side rendering, giving you access to the resolved value (in this case, the object with the id property), which ensures that the type matches what the component expects.
            By using the use hook, you ensure that React can handle the asynchronous nature of params and prevent any errors related to accessing params.id during rendering.


            **Instructions:** 
            1. **@javascript_developer:**
            - Read and analyze the file content.
            - Share the file content and your initial analysis with @senior_developer.
            - Wait for feedback and instructions from @senior_developer before proceeding.
            - When implementing changes:
                * Modify the code strictly based on @senior_developer's feedback and examples.
                * Update functions or components only as needed. Mark unused code with comments (`// UNUSED`) instead of removing it unless explicitly instructed otherwise.
                * Add or update **JSDoc comments** for all functions or components, ensuring clear and concise descriptions based on the component's purpose and @senior_developer's suggestions.
                * Keep the original functionality intact unless the feedback specifies changes. **Ensure no changes are made to the UI page, only focus on error debugging.**
                * Add inline comments explaining any updates or changes you make.
            - Share the modified file back with @senior_developer for review.

            2. **@senior_developer:**
            - Analyze the provided file and @javascript_developer's initial analysis.
            - Provide detailed feedback with clear instructions on:
                * Code improvements or fixes required.
                * Adding or refining JSDoc comments.
                * Structural or stylistic changes following Next.js and JavaScript best practices.
            - Include specific code examples wherever applicable to demonstrate improvements.
            - After reviewing the changes implemented by @javascript_developer:
                * Write a **comprehensive code review** summarizing the changes made and how they align with Next.js best practices. For example:
                    - JSDoc comments added or updated.
                    - Error handling improvements.
                    - Component structure or styling adjustments.
                * Provide a code snippet of the updated file in the review for reference. Also, save the review feedback using the `store_code_review` function.
                * End the review with "TERMINATE" to indicate final approval and completion of the process.

            **Additional Guidelines:**
            - Minimize unnecessary back-and-forth communication; provide comprehensive instructions in each step.
            - Focus on improving code quality, readability, and documentation. Avoid performance optimizations unless explicitly required.

            **Process Flow:**
            1. @javascript_developer reads and shares the file with @senior_developer.
            2. @senior_developer analyzes and provides actionable feedback with examples.
            3. @javascript_developer implements changes based on feedback.
            4. @senior_developer reviews and verifies the updates and saves the review feedback using the `store_code_review` function.
            5. @senior_developer writes a **detailed code review** summarizing:
                - Changes made.
                - Improvements achieved.
                - Any remaining suggestions or observations (if any).
            6. @senior_developer provides the final updated code snippet and ends the process by saying "TERMINATE."

            **Important:** 
            - **Do not modify the `final_path` provided** in this prompt, as it can vary in different iterations (e.g., `.tx` or `.tsx`). Always work with the exact path provided in the prompt.
            -** Do not change any complete scripts (eg: page.tsx,layout.tsx etc...).just modified for build succesfully
            
            Please begin the code review process and fix the errors as necessary to complete the build.
            """
        )



            # Wait or add logic to confirm fixes before retrying
        print("Retrying build process...")



def swap_newline(lst: list[str], swap_with: str = "\n") -> list[str]:
    new_lst = []

    first_prase = None
    for _, content in enumerate(lst):
        if _ == len(lst) - 1 and not first_prase:
            new_lst.append(content)
            break

        if swap_with not in content and not first_prase:
            new_lst.append(content)

        elif swap_with not in content and first_prase:
            new_lst.append(first_prase + content)

            first_prase = None

        else:
            last_prase = content.split("\n")[-1]

            (
                new_lst.append("\n".join(content.split(swap_with)[:-1]))
                if not first_prase
                else new_lst.append(
                    first_prase + "\n".join(content.split(swap_with)[:-1])
                )
            )
            first_prase = None
            first_prase = last_prase

    return new_lst

def split_code(filepath: Annotated[str, "Path of the file being reviewed."], default_tokens: Annotated[int, "Max tokens per chunk."] = 7000):
    try:
        with open(filepath, "r") as file:
            code = file.read()
        
        chunks = TokenTextSplitter(
            encoding_name="cl100k_base",
            chunk_size=default_tokens,
            chunk_overlap=100,
        ).split_text(code)    

        return 0, swap_newline(chunks, swap_with="const")
    except Exception as e:
        return 1, str(e)


def process_large_file(
    file_path: Annotated[str, "Path of the file being reviewed."], 
    error_msg: Annotated[str, "Error message to display if processing fails."],
    default_tokens: Annotated[int, "Max tokens per chunk."] = 7000
    ):
    try:
        status, chunks = split_code(file_path, default_tokens=7000)

        if status != 0:
            raise Exception("Large file processing failed.")

        for chunk in chunks:
            user_proxy.initiate_chat(
                manager,
                message=f"""
                @javascript_developer and @senior_developer, please process the following file: {file_path}
                
                **Issue:**
                {error_msg}
                
                **Instructions:** 
                1. **@javascript_developer:**
                - Read and analyze the shared chunk content of the file.
                - Read the error log and share it with @senior_developer.
                - Share the chunk content and your initial analysis with @senior_developer.
                - Wait for feedback and instructions from @senior_developer before proceeding.
                - When implementing changes:
                    * Modify the code strictly based on @senior_developer's feedback and examples.
                    * Update functions or components only as needed. Mark unused code with comments (`// UNUSED`) instead of removing it unless explicitly instructed otherwise.
                    * Add or update **JSDoc comments** for all functions or components, ensuring clear and concise descriptions based on the component's purpose and @senior_developer's suggestions.
                    * Keep the original functionality intact unless the feedback specifies changes.
                    * Add inline comments explaining any updates or changes you make.
                - Share the modified chunk back with @senior_developer for review.

                2. **@senior_developer:**
                - Analyze the provided chunk and @javascript_developer's initial analysis.
                - Provide detailed feedback with clear instructions on:
                    * Code improvements or fixes required.
                    * Adding or refining JSDoc comments.
                    * Structural or stylistic changes following Next.js and JavaScript best practices.
                - Include specific code examples wherever applicable to demonstrate improvements.
                - After reviewing the changes implemented by @javascript_developer:
                    * Write a **comprehensive code review** summarizing the changes made and how they align with Next.js best practices. For example:
                        - JSDoc comments added or updated.
                        - Error handling improvements.
                        - Component structure or styling adjustments.
                    * Provide a code snippet of the updated chunk in the review for reference. Also, save the review feedback using the `store_code_review` function.
                    * End the review with "TERMINATE" to indicate final approval and completion of the process.

                **Additional Guidelines:**
                - Minimize unnecessary back-and-forth communication; provide comprehensive instructions in each step.
                - Focus on improving code quality, readability, and documentation. Avoid performance optimizations unless explicitly required.

                Note: to save the updated code snippet, use the `modify_file_by_replacing` function inputting the filepath, old code, and new code.

                **Process Flow:**
                1. @javascript_developer reads and shares the chunk content with @senior_developer.
                2. @senior_developer analyzes and provides actionable feedback with examples.
                3. @javascript_developer implements changes based on feedback.
                4. @senior_developer reviews and verifies the updates and saves the review feedback using the `store_code_review` function.
                5. @senior_developer writes a **detailed code review** summarizing:
                    - Changes made.
                    - Improvements achieved.
                    - Any remaining suggestions or observations (if any).
                6. @senior_developer provides the final updated code snippet and ends the process by saying "TERMINATE". \
                if there is large content as input which you cannot able to process then you can terminate the process by typing "TERMINATE".

                Please begin the code review process.
                """)

    except Exception as e:
        return 1, str(e)
    
if __name__ == "__main__":
    process_eslint_issues()