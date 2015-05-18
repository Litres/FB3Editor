/**
 * Фабрика создания элементов для схемы текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.schema.Factory',
	{
		singleton: 'true',

		/**
		 * Создает новый элемент.
		 * @param {String} name Название элемента.
		 * @param {Object} [options] Опции элемента.
		 * @return {Object} Элемент схемы.
		 */
		createElement: function (name, options)
		{
			var me = this,
				n = name,
				opts = options,
				nameEl,
				el;

			if (Ext.isEmpty(n))
			{
				throw Error('Невозможно создать элемент схемы текста. Передано пустое назавние элемента.');
			}
			try
			{
				n = n.replace(/-([a-z])/g, '$1');
				n = Ext.String.capitalize(n);
				nameEl = 'FBEditor.editor.schema.' + n + 'Element';
				if (!opts.extend)
				{
					delete opts.extend;
				}

				// определяем и создаем класс элемента
				Ext.define(nameEl, opts);
				el = Ext.create(nameEl);
				//console.log(n, opts);
			}
			catch (e)
			{
				Ext.log(
					{
						level: 'warn',
						msg: 'Неопределенный элемент схемы текста: ' + nameEl,
						dump: e
					}
				);
			}

			return el;
		}
	}
);