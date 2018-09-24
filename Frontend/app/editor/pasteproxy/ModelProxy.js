/**
 * Прокси модели, получаемой из вставляемого фрагмента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.ModelProxy',
	{
		requires: [
			'FBEditor.editor.pasteproxy.model.ElementProxy',
			'FBEditor.editor.pasteproxy.model.ImgProxy',
			'FBEditor.editor.pasteproxy.model.StyleProxy',
			'FBEditor.editor.pasteproxy.model.TextProxy'
		],

		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Вставляемый элемент.
		 */
		el: null,

		/**
		 * @private
		 * @property {FBEditor.editor.pasteproxy.PasteProxy} Прокси данных.
		 */
		pasteProxy: null,

		/**
		 * @param data {Object}
		 * @param {FBEditor.editor.element.AbstractElement} data.el Вставляемый элемент.
		 * @param {FBEditor.editor.pasteproxy.PasteProxy} data.pasteProxy Прокси данных.
		 */
		constructor: function (data)
		{
			var me = this;

			me.el = data.el;
			me.pasteProxy = data.pasteProxy;
		},

		/**
		 * Возвращает модель, полученную путем преобразования вставляемого елемента.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getModel: function ()
		{
			var me = this,
				el = me.el;

			// нормализуем элементы
			me.normalizeElement(el);
			
			return el;
		},

		/**
		 * @private
		 * Нормализует элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		normalizeElement: function (el)
		{
			var me = this;

			if (el)
			{
				el.each(
					function (child)
					{
						//console.log('<child', child.getName(), child.elementId, '>', child.parent.getXml());
						
						// нормализуем элемент уровня стиля
						me.normalizeStyle(child);
						
						// нормализуем элемент уровня текста
						me.normalizeText(child);
						
						// нормализуем элемент списка
						me.normalizeList(child);
						
						// нормализуем элемент изображения
						me.normalizeImg(child);
						
						// нормализуем дочерний элемент
						me.normalizeElement(child);
						
						// общая нормализация для любых элементов
						me.normalizeEl(child);
					}
				);
			}
		},

		/**
		 * @private
		 * Нормализует элемент, используя общие процедуры.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		normalizeEl: function (el)
		{
			var me = this,
				parent = el.parent,
				normalize,
				elProxy;

			if (!el.isText && !el.isBr)
			{
				elProxy = Ext.create('FBEditor.editor.pasteproxy.model.ElementProxy', {el: el, modelProxy: me});
				normalize = elProxy.normalize();
			}

			if (normalize)
			{
				me.normalizeElement(parent);
			}
		},

		/**
		 * @private
		 * Нормализует стилевой элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		normalizeStyle: function (el)
		{
			var me = this,
				parent = el.parent,
				normalize = false,
				elProxy;

			if (el.isStyleType && !el.isStyleHolder)
			{
				// стилевой элемент
				elProxy = Ext.create('FBEditor.editor.pasteproxy.model.StyleProxy', {el: el, modelProxy: me});
				normalize = elProxy.normalize();
			}

			if (normalize)
			{
				me.normalizeElement(parent);
			}
		},

		/**
		 * @private
		 * Нормализует текстовый элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		normalizeText: function (el)
		{
			var me = this,
				parent = el.parent,
				normalize = false,
				elProxy;

			if (el.isText)
			{
				// текстовый элемент
				elProxy = Ext.create('FBEditor.editor.pasteproxy.model.TextProxy', {el: el, modelProxy: me});
				normalize = elProxy.normalize();
			}
			
			if (normalize)
			{
				me.normalizeElement(parent);
			}
		},

		/**
		 * @private
		 * Нормализует элемент списка ol/ul.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		normalizeList: function (el)
		{
			var me = this,
				parent = el.parent,
				pasteProxy = me.pasteProxy,
				manager = pasteProxy.manager,
				factory = manager.getFactory(),
				schema = manager.getSchema(),
				els = {},
				normalize = false,
				isChild;

			if (parent.isLiHolder)
			{
				// элемент списка
				
				// является ли элемент допустимым в списке
				isChild = schema.isChild(parent.getName(), el.getName());

				if (!isChild)
				{
					// создаем элемент li и переносим в него всех потомков из текущего элемента

					els.li = factory.createElement('li');

					while (el.first())
					{
						els.li.add(el.first());
					}

					parent.replace(els.li, el);
					normalize = true;
				}
			}

			if (normalize)
			{
				me.normalizeElement(parent);
			}
		},

		/**
		 * @private
		 * Нормализует элемент изображения.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		normalizeImg: function (el)
		{
			var me = this,
				elProxy;

			if (el.isImg)
			{
				elProxy = Ext.create('FBEditor.editor.pasteproxy.model.ImgProxy', {el: el, modelProxy: me});
				elProxy.normalize();
			}
		}
	}
);