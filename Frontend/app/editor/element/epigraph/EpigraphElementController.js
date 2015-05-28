/**
 * Кнотроллер элемента epigraph.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.epigraph.EpigraphElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		/**
		 * Создает новый эпиграф.
		 */
		onCreateElement: function (sel)
		{
			var me = this,
				cmd,
				sch,
				name,
				range,
				node,
				parentNode,
				parentEl,
				firstEl,
				firstNode,
				elements;

			name = me.getElement().xmlTag;
			sel = sel || window.getSelection();
			range = sel.getRangeAt(0);
			node = range.endContainer.parentNode;
			parentNode = node.parentNode;
			node = parentNode.getElement().xmlTag === name ? parentNode : node;
			parentNode = node.parentNode;
			sch = FBEditor.editor.Manager.getSchema();
			parentEl = parentNode.getElement();
			elements = FBEditor.editor.Manager.getNamesElements(parentEl);
			firstNode = parentNode.firstChild;
			firstEl = firstNode ? firstNode.getElement() : null;
			if (firstEl.xmlTag !== 'title')
			{
				elements.unshift(name);
			}
			else
			{
				elements.splice(1, 0, name);
			}
			if (sch.verify(parentEl.xmlTag, elements))
			{
				cmd = Ext.create('FBEditor.editor.command.epigraph.CreateCommand', {node: node});
				if (cmd.execute())
				{
					FBEditor.editor.HistoryManager.add(cmd);
				}
			}
		}
	}
);