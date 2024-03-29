/**
 * Прокси для любого элемента.
 * Реализует общие процедуры.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.model.ElementProxy',
	{
		extend: 'FBEditor.editor.pasteproxy.model.AbstractProxy',

		normalize: function ()
		{
			var me = this,
				el = me.el,
				parent = el.parent,
				normalize = false;

			if (!me.checkSchema(el))
			{
				//console.log('ERR', parent.getName(), '>', el.getName());
				//console.log('ERR parent', parent.getXml());
				//console.log('ERR el', el.getXml());

				if (el.first())
				{
					// если не соответствует схеме, то переносим всех потомков на уровень выше
					me.upChildren();
				}
				else
				{
					parent.remove(el);
				}

				normalize = true;
			}
			else if (el.isEmpty() && !el.first())
			{
				// удаляем пустой элемент
				parent.remove(el);
				normalize = true;
			}

			return normalize;
		}
	}
);