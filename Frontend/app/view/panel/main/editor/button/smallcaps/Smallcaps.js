/**
 * Кнопка создания элемента smallcaps.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.editor.button.smallcaps.Smallcaps',
    {
        extend: 'FBEditor.view.panel.main.editor.button.AbstractStyleButton',

        xtype: 'main-editor-button-smallcaps',

        html: '<i class="fa fa-text-height"></i>',

        tooltipText: 'Капитель',
        elementName: 'smallcaps'
    }
);