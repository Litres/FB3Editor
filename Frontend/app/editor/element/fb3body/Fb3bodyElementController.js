/**
 * Кнотроллер элемента fb3-body.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.fb3body.Fb3bodyElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		/**
		 * Редактирование текстового узла.
		 * @param {Object} e Событие.
		 * @param {HTMLElement} e.target Редактируемый узел.
		 */
		onTextModified: function (e)
		{
			var me = this,
				node = e.target,
				text = node.nodeValue,
				viewportId = node.viewportId,
				nextSibling = node.nextSibling,
				previousSibling = node.previousSibling,
				parentNode = node.parentNode,
				parentEl,
				el,
				focusNode;

			focusNode = me.getFocusNode(e.target);
			if (!parentNode.getElement)
			{
				Ext.defer(function () {me.onTextModified({target: node});}, 1);

				return;
			}
			console.log('DOMCharacterDataModified:', node, me);
			if (!nextSibling && !previousSibling)
			{
				el = FBEditor.editor.Factory.createElementText(text);
				el.createNode(viewportId);
				parentEl = parentNode.getElement();
				parentEl.removeAll();
				parentEl.add(el);
				parentEl.sync(viewportId);
			}
			else
			{
				el = node.getElement();
				el.setText(text);
				el.sync(viewportId);
			}
		}
	}
);