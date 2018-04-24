/**
 * Элемент smallcaps.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.editor.element.smallcaps.SmallcapsElement',
    {
        extend: 'FBEditor.editor.element.AbstractStyleElement',
        requires: [
            'FBEditor.editor.element.smallcaps.SmallcapsElementController',
            'FBEditor.editor.command.smallcaps.CreateRangeCommand',
            'FBEditor.editor.command.smallcaps.DeleteWrapperCommand'
        ],

        controllerClass: 'FBEditor.editor.element.smallcaps.SmallcapsElementController',
        htmlTag: 'smallcaps',
        xmlTag: 'smallcaps',
        cls: 'el-smallcaps'
    }
);