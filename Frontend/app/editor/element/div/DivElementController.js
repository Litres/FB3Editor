/**
 * Кнотроллер элемента div.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.div.DivElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		/**
		 * Создает новый блок.
		 */
		onCreateElement: function (sel)
		{
			var me = this,
				cmd,
				sch,
				name,
				range,
				node,
				el,
				parentNode,
				parentEl,
				elements,
				pos;

			name = me.getElement().xmlTag;
			sel = sel || window.getSelection();
			range = sel.getRangeAt(0);
			node = range.endContainer.parentNode;
			parentNode = node.parentNode;
			node = parentNode.getElement().xmlTag === name ? parentNode : node;
			el = node.getElement();
			parentNode = node.parentNode;
			sch = FBEditor.editor.Manager.getSchema();
			parentEl = parentNode.getElement();
			elements = FBEditor.editor.Manager.getNamesElements(parentEl);
			pos = parentEl.getChildPosition(el);
			elements.splice(pos + 1, 0, name);
			if (sch.verify(parentEl.xmlTag, elements))
			{
				cmd = Ext.create('FBEditor.editor.command.div.CreateCommand', {node: node});
				if (cmd.execute())
				{
					FBEditor.editor.HistoryManager.add(cmd);
				}
			}
		}
	}
);