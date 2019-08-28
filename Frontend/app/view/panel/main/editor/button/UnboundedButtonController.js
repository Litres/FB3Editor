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
				name = btn.elementName,
				manager = btn.getEditorManager(),
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
				els.node = els.node.getSplittable();
				
				if (els.node)
				{
					els.start = range.start.getElement();
					els.startSplit = els.start.getSplittable();
					els.end = range.end.getElement();
					els.endSplit = els.end.getSplittable();
					
					if (els.startSplit.equal(els.endSplit))
					{
						// если начальная и конечная точки выделения находятся в одном и том же делимом элементе
						
						hash[name] = me.getHash(els.node);
						me.verifyHash(hash);
						
						return;
					}
				}
			}
			else
			{
				els.node = els.node.getStyleHolder();
				
				if (els.node)
				{
					els.parent = els.node.getParent();
					els.node = els.parent.hisName(name) ? els.parent : els.node;
					els.node = els.node.isRoot ? els.node : els.node.getParent();
					
					hash[name] = me.getHash(els.node);
					me.verifyHash(hash);
					
					return;
				}
			}
			
			me.verifyResult(false);
		}
	}
);