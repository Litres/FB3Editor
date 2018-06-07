/**
 * Кнопка разделения секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.editor.button.splitsection.SplitSection',
    {
        extend: 'FBEditor.editor.view.toolbar.button.AbstractButton',
        requires: [
            'FBEditor.view.panel.main.editor.button.splitsection.SplitSectionController'
        ],

        controller: 'editor.toolbar.button.splitsection',

        xtype: 'main-editor-button-splitsection',

        html: '<i class="fa fa-cut"></i>',

        tooltipText: 'Разделить секцию',

        isActiveSelection: function ()
        {
            var me = this,
                active = false,
                sel = window.getSelection(),
                els = {},
                range;

            range = sel.rangeCount ? sel.getRangeAt(0) : null;

            if (!range || !range.commonAncestorContainer.getElement)
            {
                return false;
            }

            els.common = range.commonAncestorContainer.getElement();

            // находится ли текущее выделение внутри секции
            els.isSection = els.common.hasParentName('section');

            active = els.isSection ? true : active;

            return active;
        }
    }
);