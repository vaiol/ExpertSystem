#include <iostream>

int run_python_script(const char *path_to_python_file, const char *path_to_data_file) {
    std::string argument = path_to_data_file;
    std::string filename = path_to_python_file;
    std::string command = "python ";
    filename += " " + argument;
    command += filename;

    /*
     * Command should be "python path/to/main.py path/to/input/file"
     * Example: "python ../logic/main.py ../logic/tests/basic/baba.txt"
     */
    printf("Running [%s]\n\n", command.c_str());
    int exit_code = system(command.c_str());
    printf("\nDone\n");
    return exit_code;
}

int main(int argc, char **argv) {
    /*
     * Hard code path to main.py
     */
    const char *path_to_python_file = "../logic/main.py";

    /*
     * 'Input file' as argument
     */
    const char *path_to_data_file = argv[1];

    /*
     * Run python script and return exit code.
     * If exit code == 0, all good, results will be in ./result/log
     * If exit code == 1, error/s occurred, errors will be in ./result/errors
     */
    int exit_code = run_python_script(path_to_python_file, path_to_data_file);

    /*
     * Check exit code
     */
    printf("\nThe exit code is: %d\n\n", WEXITSTATUS(exit_code));
    if (exit_code == 0) {
        printf("Program fished without errors. Please check ''./result/log'' for results\n\n");
    }
    else {
        printf("Program fished with error. Please check ''./result/errors'' for errors\n\n");
    }
    return 0;
}
