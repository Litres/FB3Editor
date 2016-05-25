/**
 * Контроллер кнопки section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.section.SectionController',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.ButtonController',
		alias: 'controller.panel.toolstab.main.button.section',

		/**
		 * Синхронизирует кнопку, проверяя структуру, не используя проверку по схему.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.getEditorManager(),
				els = {},
				nodes = {},
				viewportId,
				range;

			range = manager.getRange();

			if (!range)
			{
				btn.disable();
				return;
			}

			nodes.node = range.common;

			if (!nodes.node.getElement || nodes.node.getElement().isRoot)
			{
				btn.disable();
				return;
			}

			viewportId = nodes.node.viewportId;

			els.node = nodes.node.getElement();
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();

			els.parent = els.node.getParentName('section');
			els.parent = els.parent ? els.parent : els.node.getParentName('main');

			if (!els.parent)
			{
				btn.disable();
				return;
			}

			nodes.parent = els.parent.nodes[viewportId];

			// ищем существующую вложенную секцию
			nodes.next = nodes.parent.firstChild;
			els.next = nodes.next ? nodes.next.getElement() : null;
			while (els.next)
			{
				if (els.next.isSection)
				{
					// вложенная секция уже существует
					btn.disable();

					return;
				}
				nodes.next = nodes.next.nextSibling;
				els.next = nodes.next ? nodes.next.getElement() : null;
			}

			btn.enable();
		}
	}
);