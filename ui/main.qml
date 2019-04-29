import QtQuick 2.7
import QtQuick.Dialogs 1.2
import QtQuick.Controls 2.0
import QtQuick.Controls 2.2
import QtQuick.Layouts 1.3

import core 1.0

ApplicationWindow {
    id: mainWindow
    visible: true
    width: 640
    height: 480
    minimumWidth: 640
    minimumHeight: 480
    title: qsTr("Expert System")

    Core {
        id: appCore

        onFileContent: textEdit.text = fileText

        onWriteOutput: compileOutput.text = pyOutput

        onDrawRedLines: {
            for (var j = 0; j < redLines.length; j++) {
                if (redLines[j] < repeaterLines.count) {
                    repeaterLines.itemAt(redLines[j]).color = "#db4848"
                }
            }
        }
    }

    header: Rectangle {
        width: parent.width
        height: 50
        color: "#fbfbfb"

        Button {
            id: openFileButton
            onClicked: openFileDialog.open()
            height: 50
            width: 50
            background: Rectangle {
                anchors.fill: parent
                color: openFileButton.pressed ? "#c6c6c6" : "#fbfbfb"

                Image {
                    id: openImg
                    height: 40
                    width: 40
                    source: "./img/open_icon.png"
                    anchors.centerIn: parent
                }
            }
        }

        Button {
            id: runButton
            onClicked: appCore.runProgram(textEdit.text)
            height: 50
            width: 50
            anchors.left: openFileButton.right
            background: Rectangle {
                anchors.fill: parent
                color: runButton.pressed ? "#c6c6c6" : "#fbfbfb"

                Image {
                    id: runImg
                    height: 40
                    width: 40
                    source: "./img/run_icon.png"
                    anchors.centerIn: parent
                }
            }
        }

        Button {
            id: saveFileButton
            onClicked: saveFileDialog.open()
            height: 50
            width: 50
            anchors.right: parent.right
            background: Rectangle {
                anchors.fill: parent
                color: saveFileButton.pressed ? "#c6c6c6" : "#fbfbfb"

                Image {
                    id: saveImg
                    height: 35
                    width: 35
                    source: "./img/save_icon.png"
                    anchors.centerIn: parent
                }
            }
        }
    }

    Column {
        id: mainColumn
        anchors.fill: parent

        Rectangle {
            width: parent.width
            height: 30
            color: "#303030"
            Text {
                anchors.verticalCenter: parent.verticalCenter
                x: 20
                text: qsTr("File edit")
                font.family: "sans-serif"
                font.pixelSize: 18
                color: "#fbfbfb"
            }
        }

        Rectangle {
            width: parent.width
            height: parent.height - 30
            color: "#595959"

            Flickable {
                anchors.fill: parent
                clip: true
                contentHeight: itemScroll.height
                contentWidth: itemScroll.width
                ScrollBar.horizontal: ScrollBar {active: true}
                ScrollBar.vertical: ScrollBar {active: true}
                Item {
                    id: itemScroll
                    width: parent.width
                    height: textEdit.height

                    Column {
                        Repeater {
                            id: repeaterLines
                            model: textEdit.lineCount

                            Rectangle {
                                height: 17
                                width: mainColumn.width
                                color: index % 2 ? "#606060" : "#595959"

                                Text {
                                    x: 5
                                    text: index + 1
                                    font.family: "sans-serif"
                                    font.bold: true
                                    font.pixelSize: 14
                                    color: "#b2b2b2"
                                }
                            }
                        }
                    }

                    TextEdit {
                        id: textEdit
                        onTextChanged: {
                            for (var i = 0; i < repeaterLines.count; i++) {
                                repeaterLines.itemAt(i).color = (i % 2) ? "#606060" : "#595959"
                            }
                        }
                        anchors.left: parent.left
                        anchors.leftMargin: 35
                        text: qsTr("# Write here, or open the file")
                        font.family: "sans-serif"
                        font.pixelSize: 14
                        color: "white"
                    }
                }
            }
        }
    }

    footer: Column {
        Rectangle {
            width: parent.width
            height: 30
            color: "#303030"
            Text {
                anchors.verticalCenter: parent.verticalCenter
                x: 20
                text: qsTr("Compile output")
                font.family: "sans-serif"
                font.pixelSize: 18
                color: "#fbfbfb"
            }
        }

        Rectangle {
            width: parent.width
            height: 180
            color: "#595959"
            ScrollView {
                anchors.fill: parent
                clip: true
                Text {
                    id: compileOutput
                    font.family: "sans-serif"
                    font.pixelSize: 15
                    color: "#fbfbfb"
                }
            }
        }
    }

    FileDialog {
        id: openFileDialog
        title: "Please choose a file"
        folder: shortcuts.home
        onAccepted: appCore.openFile(openFileDialog.fileUrls)
    }

    FileDialog {
        id: saveFileDialog
        title: "Please choose place to save a file"
        folder: shortcuts.home
        selectExisting: false
        onAccepted: appCore.saveFile(saveFileDialog.fileUrls, textEdit.text)
    }
}
