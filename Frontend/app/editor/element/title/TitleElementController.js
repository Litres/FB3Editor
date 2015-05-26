/**
 * Кнотроллер элемента title.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.title.TitleElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',
		requires: [
			'FBEditor.editor.command.title.CreateCommand'
		],

		/**
		 * Создает новый заголовок.
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
				elements;

			name = me.getElement().xmlTag;
			sel = sel || window.getSelection();
			range = sel.getRangeAt(0);
			node = range.endContainer.parentNode;
			parentNode = node.parentNode;
			node = parentNode.nodeName === 'HEADER' ? parentNode : node;
			parentNode = node.parentNode;
			sch = FBEditor.editor.Manager.getSchema();
			parentEl = parentNode.getElement();
			elements = FBEditor.editor.Manager.getNamesElements(parentEl);
			elements.unshift(name);
			if (sch.verify(parentEl.xmlTag, elements))
			{
				cmd = Ext.create('FBEditor.editor.command.title.CreateCommand', {node: node});
				if (cmd.execute())
				{
					FBEditor.editor.HistoryManager.add(cmd);
				}
			}
		}
	}
);