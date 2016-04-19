/**
 * Кнотроллер элемента fb3-body.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.fb3body.Fb3bodyElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',
		requires: [
			'FBEditor.editor.command.TextModifiedCommand'
		],

		/**
		 * Редактирование текстового узла.
		 * @param {Object} e Событие.
		 * @param {Node} e.target Редактируемый узел.
		 */
		onTextModified: function (e)
		{
			var me = this,
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				node = e.target,
				text = node.nodeValue,
				viewportId = node.viewportId,
				nextSibling = node.nextSibling,
				previousSibling = node.previousSibling,
				parentNode = node.parentNode,
				parentEl,
				el,
				cmd;

			if (manager.suspendEvent)
			{
				return;
			}

			if (!parentNode.getElement)
			{
				Ext.defer(
					function ()
					{
						this.onTextModified({target: node});
					},
					1,
				    me
				);

				return;
			}

			el = node.getElement ? node.getElement() : null;

			//console.log('DOMCharacterDataModified:', e, me);

			if (!nextSibling && !previousSibling)
			{
				el = factory.createElementText(text);
				el.createNode(viewportId);
				parentEl = parentNode.getElement();
				parentEl.removeAll();
				parentEl.add(el);
			}

			cmd = Ext.create('FBEditor.editor.command.TextModifiedCommand',
			                 {node: node, newValue: e.newValue, oldValue: e.prevValue});

			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
		}
	}
);