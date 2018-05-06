/**
 * Элемент clipped.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.editor.element.clipped.ClippedElement',
    {
        extend: 'FBEditor.editor.element.AbstractElement',
        requires: [
            'FBEditor.editor.element.clipped.ClippedElementController'
        ],

        controllerClass: 'FBEditor.editor.element.clipped.ClippedElementController',
        htmlTag: 'clipped',
        xmlTag: 'clipped',
        cls: 'el-clipped'
    }
);