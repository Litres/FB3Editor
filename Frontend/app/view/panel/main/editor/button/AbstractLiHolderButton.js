/**
 * Абстрактная кнопка создания элемента списка, содержащих элементы li.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.AbstractLiHolderButton',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',

		isActiveSelection: function ()
		{
			var me = this,
				manager = me.getEditorManager(),
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

			// первый абзац
			nodes.first = range.start;
			els.first = nodes.first.getElement ? nodes.first.getElement() : null;
			els.first = els.first.getStyleHolder();

			if (!els.first)
			{
				return false;
			}

			els.parent = els.first.parent;
			els.pos = els.parent.getChildPosition(els.first);

			// получаем дочерние имена элементов для проверки по схеме
			nameElements = manager.getNamesElements(els.parent);
			nameElements.splice(els.pos, 1, name);

			// проверяем элемент по схеме
			sch = manager.getSchema();
			name = els.parent.getName();
			enable = sch.verify(name, nameElements, true);

			console.log('active', enable, name, nameElements);

			return enable;
		}
	}
);