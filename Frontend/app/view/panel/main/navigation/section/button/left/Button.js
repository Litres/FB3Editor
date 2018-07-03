/**
 * Кнопка сдвига секции влево.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.panel.main.navigation.section.button.left.Button',
    {
        extend: 'FBEditor.view.panel.main.navigation.section.button.AbstractButton',
        requires: [
            'FBEditor.editor.command.section.LeftCommand'
        ],

        xtype: 'panel-navigation-section-button-left',

        html: '<i class="fa fa-arrow-left"></i>',

        tooltip: 'Сдвинуть секцию влево',

        cmdClass: 'FBEditor.editor.command.section.LeftCommand',

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

                // текущая секция
                els.section = els.focus.isSection ? els.focus : els.focus.getParentName('section');

                // предыдущая секция или элемент
                els.prev = els.section.prev();

                // родительская секция
                els.parent = els.section && els.section.parent ? els.section.parent : null;

                isActive = els.parent && els.parent.isSection ? true : isActive;
            }

            return isActive;
        }
    }
);