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

		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager,
				els = {},
				nodes = {},
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

			els.node = nodes.node.getElement();
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();

			while (!els.parent.isSection && !els.parent.isRoot)
			{
				// ищем родительскую секцию или корневой элемент
				nodes.parent = nodes.parent.parentNode;
				els.parent = nodes.parent.getElement();
			}

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