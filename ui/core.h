#ifndef CORE_H
#define CORE_H

#include <QObject>

class Core : public QObject
{
    Q_OBJECT
public:
    explicit Core(QObject *parent = nullptr) : QObject(parent) {}

signals:
    void    fileContent(QString fileText);
    void    drawRedLines(QList<int> redLines);
    void    writeOutput(QString pyOutput);

public slots:
    void    openFile(QString pass);
    void    runProgram(QString textEdit);
    void    saveFile(QString pass, QString textEdit);
};

#endif // CORE_H

