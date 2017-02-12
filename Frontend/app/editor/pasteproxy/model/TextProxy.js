/**
 * Прокси текстового элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.model.TextProxy',
	{
		extend: 'FBEditor.editor.pasteproxy.model.AbstractProxy',

		normalize: function ()
		{
			var me = this,
				el = me.el,
				normalize = false;

			if (el.next() && el.next().isText)
			{
				// объединяем соседние текстовые элементы
				el.text = el.text + el.next().text;
				el.parent.remove(el.next());
				normalize = true;
			}

			if (!el.parent.isStyleType)
			{
				//console.log(el.text, el.parent.getName());
				// помещаем текст в абзац, если он находится не в стилевом элементе
				me.moveElsToNewHolder(el);
				normalize = true;
			}

			return normalize;
		}
	}
);