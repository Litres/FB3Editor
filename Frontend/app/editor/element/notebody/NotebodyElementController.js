/**
 * Контроллер элемента notebody.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.notebody.NotebodyElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNodeVerify: function (sel, opts)
		{
			var me = this,
				name = me.getNameElement(),
				manager = FBEditor.getEditorManager(),
				els = {},
				nodes = {},
				res = false,
				helper,
				sch,
				range,
				nameElements;

			// получаем узел из выделения
			range = manager.getRangeCursor();

			nodes.node = range.end;
			els.node = nodes.node.getElement();
			els.parent = els.node.getParentName('notes');

			if (!els.parent)
			{
				return false;
			}

			els.notebody = els.node.getParentName('notebody');
			els.first = els.parent.first();

			// получаем дочерние имена элементов для проверки по схеме

			nameElements = manager.getNamesElements(els.parent);

			if (!els.first.isTitle)
			{
				nameElements.unshift(name);
			}
			else
			{
				nameElements.splice(1, 0, name);
			}

			// проверяем элемент по схеме
			
			sch = manager.getSchema();
			name = els.parent.getName();
			
			//console.log('name, nameElements', name, nameElements);
			
			if (sch.verify(name, nameElements))
			{
				helper = els.notebody.getNodeHelper();
				res = helper.getNode();
			}

			return res;
		}
	}
);