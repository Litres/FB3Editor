/**
 * Контроллер кнопки title.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.title.TitleController',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.ButtonController',
		alias: 'controller.panel.toolstab.main.button.title',

		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager,
				nodes = {},
				els = {},
				name = btn.elementName,
				range,
				nameElements,
				sch,
				enable;

			range = manager.getRange();

			if (!range)
			{
				btn.disable();

				return;
			}

			nodes.node = range.common;
			els.node = nodes.node.getElement();

			if (els.node.isRoot)
			{
				btn.disable();

				return;
			}

			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();

			while (els.parent.isStyleHolder || els.parent.isStyleType)
			{
				nodes.node = nodes.parent;
				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
			}

			// получаем дочерние имена элементов для проверки по схеме
			nameElements = manager.getNamesElements(els.parent);
			nameElements.unshift(name);

			name = els.parent.getName();

			// проверяем элемент по схеме
			sch = manager.getSchema();
			//console.log('name, nameElements', name, nameElements);
			enable = sch.verify(name, nameElements);

			if (enable)
			{
				btn.enable();
			}
			else
			{
				btn.disable();
			}
		}
	}
);