/**
 * Кнотроллер элемента img.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.img.ImgElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		onKeyDown: function (e)
		{
			var me = this,
				node = e.target,
				parentNode = node.parentNode;

			if (e.keyCode === Ext.event.Event.DELETE || e.keyCode === Ext.event.Event.BACKSPACE)
			{
				// удаляем изображение
				parentNode.removeChild(node);
				FBEditor.editor.Manager.setFocusElement(parentNode.getElement());
			}
			e.preventDefault();
			e.stopPropagation();

			return false;
		}
	}
);