/**
 * Элемент paperpagebreak.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.editor.element.paperpagebreak.PaperpagebreakElement',
    {
        extend: 'FBEditor.editor.element.AbstractElement',
        requires: [
            'FBEditor.editor.element.paperpagebreak.PaperpagebreakElementController'
        ],

        controllerClass: 'FBEditor.editor.element.paperpagebreak.PaperpagebreakElementController',
        htmlTag: 'paper-page-break',
        xmlTag: 'paper-page-break',
        cls: 'el-paperpagebreak'
    }
);