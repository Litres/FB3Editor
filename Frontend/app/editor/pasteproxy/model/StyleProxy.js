/**
 * Прокси стилевого элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.model.StyleProxy',
	{
		extend: 'FBEditor.editor.pasteproxy.model.AbstractProxy',

		normalize: function ()
		{
			var me = this,
				el = me.el,
				normalize = false;

			if (el.isEmpty())
			{
				// пустой элемент

				if (!el.parent.isEmpty())
				{
					// если родительский элемент не пустой, то удаляем пустой элемент
					el.parent.remove(el);
					normalize = true;
				}
			}
			else if (!el.parent.isStyleType)
			{
				// помещаем все стилевые элементы в абзац, если они находятся не в стилевом элементе
				me.moveElsToNewHolder(el);
				normalize = true;
			}
			else if (el.next() && el.hisName(el.next().getName()))
			{
				// объединяем однотипные соседние элементы
				me.joinNext();
				normalize = true;
			}

			return normalize;
		},

		/**
		 * Объединяет элемент с соседним.
		 */
		joinNext: function ()
		{
			var me = this,
				el = me.el,
				els = {};

			els.next = el.next();
			els.first = els.next.first();

			while (els.first)
			{
				el.add(els.first);
				els.first = els.next.first();
			}

			el.parent.remove(els.next);
		}
	}
);