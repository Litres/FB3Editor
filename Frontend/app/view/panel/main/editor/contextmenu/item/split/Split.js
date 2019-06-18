/**
 * Рассечение секции в укзаном месте.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.contextmenu.item.split.Split',
	{
		extend: 'FBEditor.view.panel.main.editor.contextmenu.item.Item',
		requires: [
			'FBEditor.view.panel.main.editor.contextmenu.item.split.SplitController'
		],
		
		xtype: 'contextmenu-main-editor-item-split',
		controller: 'contextmenu.main.editor.item.split',
		
		text: 'Рассечь главу в этом месте',
		
		isActive: function ()
		{
			var me = this,
				splitBtn,
				active;
			
			splitBtn = me.getSplitButton();
			
			if (!splitBtn)
			{
				splitBtn = Ext.widget('main-editor-button-splitsection');
				active = splitBtn.isActiveSelection();
				splitBtn.destroy();
			}
			else
			{
				active = splitBtn.isActiveSelection();
			}
			
			return active;
		},
		
		/**
		 * Возвращает кнопку рассечения секции.
		 * @return {FBEditor.view.panel.main.editor.button.splitsection.SplitSection}
		 */
		getSplitButton: function ()
		{
			var me = this,
				el = me.getElement(),
				editor,
				toolbar,
				btn;
			
			editor = el.getEditor();
			toolbar = editor.getToolbar();
			btn = toolbar.getButton('splitsection');
			
			return btn;
		}
	}
);