/**
 * Кнопка сдвига секции вправо.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.navigation.section.button.right.Button',
    {
        extend: 'FBEditor.view.panel.main.navigation.section.button.AbstractButton',
        requires: [
            'FBEditor.editor.command.section.RightCommand'
        ],

        xtype: 'panel-navigation-section-button-right',

        html: '<i class="fa fa-arrow-right"></i>',

        tooltip: 'Сдвинуть секцию вправо',

        cmdClass: 'FBEditor.editor.command.section.RightCommand',

        isActiveSelection: function ()
        {
            var me = this,
                isActive = false,
                els = {},
                manager,
                sel,
                range;

            // получаем данные из выделения
            sel = window.getSelection();
            range = sel.rangeCount ? sel.getRangeAt(0) : null;

            if (range)
            {
                els.node = range.commonAncestorContainer.getElement();
                manager = els.node.getManager();
                els.focus = manager.getFocusElement();

                if (els.focus)
                {
                    // текущая секция
                    els.section = els.focus.isSection ? els.focus : els.focus.getParentName('section');

                    // предыдущая секция
                    els.sectionPrev = els.section ? els.section.prev() : null;

                    isActive = els.sectionPrev && els.sectionPrev.isSection ? true : isActive;
                }
            }

            return isActive;
        }
    }
);