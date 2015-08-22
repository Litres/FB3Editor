/**
 * Абстрактная кнопка создания элемента списка, содержащих элементы li.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.AbstractLiHolderButton',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractToggleButton',

		isActiveSelection: function ()
		{
			var me = this,
				manager = FBEditor.editor.Manager,
				nodes = {},
				els = {},
				name = me.elementName,
				range,
				nameElements,
				sch,
				enable;

			range = manager.getRange();

			if (!range)
			{
				return false;
			}

			// первый параграф
			nodes.first = range.start;

			if (!nodes.first.getElement || nodes.first.getElement().isRoot)
			{
				return false;
			}

			els.first = nodes.first.getElement();
			while (!els.first.isP && !els.first.isRoot)
			{
				nodes.first = nodes.first.parentNode;
				els.first = nodes.first.getElement();
			}

			if (!els.first.isP)
			{
				return false;
			}

			nodes.parent = nodes.first.parentNode;
			els.parent = nodes.parent.getElement();
			els.pos = els.parent.getChildPosition(els.first);

			// получаем дочерние имена элементов для проверки по схеме
			nameElements = manager.getNamesElements(els.parent);
			nameElements.splice(els.pos, 1, name);

			// проверяем элемент по схеме
			sch = manager.getSchema();
			name = els.parent.getName();
			//console.log('name, nameElements', name, nameElements);
			enable = sch.verify(name, nameElements);

			return enable;
		}
	}
);