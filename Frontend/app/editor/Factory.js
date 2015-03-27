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
			'FBEditor.editor.element.AElement',
			'FBEditor.editor.element.AnnotationElement',
			'FBEditor.editor.element.BElement',
			'FBEditor.editor.element.BlockquoteElement',
			'FBEditor.editor.element.BrElement',
			'FBEditor.editor.element.DivElement',
			'FBEditor.editor.element.EmElement',
			'FBEditor.editor.element.Fb3bodyElement',
			'FBEditor.editor.element.ImgElement',
			'FBEditor.editor.element.LiElement',
			'FBEditor.editor.element.MarkerElement',
			'FBEditor.editor.element.NoteElement',
			'FBEditor.editor.element.NotesElement',
			'FBEditor.editor.element.OlElement',
			'FBEditor.editor.element.PElement',
			'FBEditor.editor.element.SectionElement',
			'FBEditor.editor.element.StrikethroughElement',
			'FBEditor.editor.element.StrongElement',
			'FBEditor.editor.element.SubElement',
			'FBEditor.editor.element.SubscriptionElement',
			'FBEditor.editor.element.SupElement',
			'FBEditor.editor.element.TitleElement',
			'FBEditor.editor.element.UElement',
			'FBEditor.editor.element.UlElement',
			'FBEditor.editor.element.TextElement',
			'FBEditor.editor.element.UndefinedElement'
		],

		/**
		 * Создает новый элемент.
		 * @param {String} name Название элемента.
		 * @param {Object} attributes Атрибуты элемента.
		 * @param {FBEditor.editor.element.AbstractElement[]} [children] Дочерние элементы.
		 * @return {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		createElement: function (name, attributes, children)
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
				el = Ext.create(nameEl, attributes, children);
			}
			catch (e)
			{
				el = Ext.create('FBEditor.editor.element.UndefinedElement', attributes, children);
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