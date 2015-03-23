/**
 * Фабрика создания элементов для редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.Factory',
	{
		singleton: 'true',
		requires: [
			'FBEditor.editor.element.TextElement',
			'FBEditor.editor.element.UndefinedElement'
		],

		/**
		 * Создает новый элемент.
		 * @param {String} name Название элемента.
		 * @param {FBEditor.editor.element.AbstractElement[]} [children] Дочерние элементы.
		 * @return {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		createElement: function (name, children)
		{
			var me = this,
				n = name,
				nameEl,
				el;

			if (Ext.isEmpty(n))
			{
				throw Error('Невозможно создать элемент. Передано пустое назавние элемента.');
			}
			try
			{
				n = Ext.String.capitalize(n);
				n = n.replace(/-([a-z])/g, '$1');
				nameEl = 'FBEditor.editor.element.' + n + 'Element';
				el = Ext.create(nameEl, children);
			}
			catch (e)
			{
				el = Ext.create('FBEditor.editor.element.UndefinedElement', children);
				Ext.log(
					{
						level: 'warn',
						msg: 'Неопределенный элемент: ' + nameEl,
						dump: e
					}
				);
			}

			return el;
		},

		/**
		 * Создает текстовый элемент.
		 * @param {String} text Текст.
		 * @return {FBEditor.editor.element.TextElement} Текстовый элемент.
		 */
		createElementText: function (text)
		{
			var el;

			if (Ext.isEmpty(text))
			{
				throw Error('Невозможно создать текстовый элемент. Передан пустой текст.');
			}
			try
			{
				el = Ext.create('FBEditor.editor.element.TextElement', text);
			}
			catch (e)
			{
				throw Error('Невозможно создать текстовый элемент: ' + text);
			}

			return el;
		}
	}
);