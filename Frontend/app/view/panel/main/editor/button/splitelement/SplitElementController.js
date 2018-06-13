/**
 * Контроллер кнопки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.editor.button.splitelement.SplitElementController',
    {
        extend: 'FBEditor.editor.view.toolbar.button.ButtonController',

        alias: 'controller.editor.toolbar.button.splitelement',

        onClick: function (button, e)
        {
            var me = this,
                sel = window.getSelection(),
                els = {},
                range;

            if (e)
            {
                e.stopPropagation();
            }

            range = sel.rangeCount ? sel.getRangeAt(0) : null;

            if (!range || !range.commonAncestorContainer.getElement)
            {
                return false;
            }

            els.common = range.commonAncestorContainer.getElement();

            // выбрасываем событие разбивки элемента
            els.common.fireEvent('splitElement', range.commonAncestorContainer, false);
        }
    }
);