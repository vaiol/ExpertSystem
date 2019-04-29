#include "core.h"
#include <QDebug>
#include <QFile>
#include <array>
#include <stdlib.h>

namespace {
std::string exec(const char* cmd) {
    std::array<char, 128> buffer;
    std::string result;
    std::shared_ptr<FILE> pipe(popen(cmd, "r"), pclose);

    if (!pipe) throw std::runtime_error("popen() failed!");
    while (!feof(pipe.get())) {
        if (fgets(buffer.data(), 128, pipe.get()) != nullptr)
            result += buffer.data();
    }
    return result;
}

void    getRedLines(QString r, QList<int> &l) {
    QStringList lines = r.split('\n');

    for (int i = 0; i < lines.size(); i++) {
        if (lines[i][1] == 'l' && lines[i][2] == 'i' && lines[i][3] == 'n' && lines[i][4] == 'e') {
            l.push_back(atoi((lines[i].mid(6, lines[i].size() - 6)).toStdString().c_str()) - 1);
        }
    }
}

} // namespace

void Core::openFile(QString pass) {
    QFile   file(pass.remove(0, 5));
    QString content;

    if (!file.open(QIODevice::ReadOnly | QIODevice::Text))
        return;

    while (!file.atEnd())
           content += file.readLine();

    file.close();
    emit fileContent(content);
}

void Core::saveFile(QString pass, QString textEdit) {
    QFile   file(pass.remove(0, 5));

    if (!file.open(QIODevice::ReadWrite))
        return;

    QTextStream stream(&file);
    stream << textEdit;

    file.close();
}

void Core::runProgram(QString textEdit) {
    QString command = "python ../../../logic/ui.py \"" + textEdit + "\"";
    QString pyStdOut(exec(command.toStdString().c_str()).c_str());
    QList<int> redLines;

    getRedLines(pyStdOut, redLines);

    emit writeOutput(pyStdOut);
    emit drawRedLines(redLines);
}
