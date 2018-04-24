/**
 * Создает smallcaps из выделения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.editor.command.smallcaps.CreateRangeCommand',
    {
        extend: 'FBEditor.editor.command.AbstractCreateRangeStyleCommand',

        elementName: 'smallcaps'
    }
);