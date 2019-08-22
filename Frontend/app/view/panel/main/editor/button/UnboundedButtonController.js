/**
 * Контроллер кнопки элемента блочного типа неограниченного по количеству.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.UnboundedButtonController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',

		/**
		 * Синхронизирует кнопку, используя проверку по схему.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
				name = btn.elementName,
				els = {},
				hash = {},
				range;
			
			if (!manager.availableSyncButtons())
			{
				me.verifyResult(true);
				return;
			}
			
			range = manager.getRange();

			if (!range || !range.common.getElement || range.common.getElement().isRoot)
			{
				me.verifyResult(false);
				return;
			}
			
			els.node = range.common.getElement();
			
			if (!range.collapsed)
			{
				// ищем самый верхниий элемент, который может делиться на несколько
				while (!els.node.splittable)
				{
					els.node = els.node.getParent();
					
					if (els.node.isRoot)
					{
						me.verifyResult(false);
						return;
					}
				}
			}
			else
			{
				els.node = els.node.getStyleHolder();
				els.parent = els.node.getParent();
				els.node = els.parent.hisName(name) ? els.parent : els.node;
				els.node = els.node.isRoot ? els.node : els.node.getParent();
			}
			
			hash[name] = me.getHash(els.node);
			me.verifyHash(hash);
		}
	}
);