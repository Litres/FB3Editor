/**
 * Кнопка разделения секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.editor.button.splitelement.SplitElement',
    {
        extend: 'FBEditor.editor.view.toolbar.button.AbstractButton',
        requires: [
            'FBEditor.view.panel.main.editor.button.splitelement.SplitElementController'
        ],

        controller: 'editor.toolbar.button.splitelement',

        xtype: 'main-editor-button-splitelement',

        //html: '<i class="fa fa-border fa-cut"></i>',
	    iconCls: 'litres-icon-cut',
	    text: 'Рассечь блок',

        tooltipText: 'Рассечь блок',

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
	
	        // находится ли текущее выделение внутри списка
	        els.isLi = els.common.hasParentName('li');

            active = els.isSection && !els.isLi ? true : active;

            return active;
        }
    }
);