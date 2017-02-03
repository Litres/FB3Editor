/**
 * Прокси модели, получаемой из вставляемого фрагмента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.ModelProxy',
	{
		requires: [
			'FBEditor.editor.pasteproxy.model.ImgProxy'
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

			el.each(
				function (child)
				{
					//console.log('child', child);
					
					// нормализуем элемент уровня блока
					me.normalizeBlock(child);

					// нормализуем элемент уровня абзаца
					me.normalizeStyleHolder(child);

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
				}
			);
		},

		/**
		 * @private
		 * Нормализует блочный элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		normalizeBlock: function (el)
		{
			var me = this,
				parent = el.parent,
				normalize = false;

			if (!el.isStyleType && !el.isText && !el.isImg)
			{
				// элемент уровня блока

				if (parent.isStyleType)
				{
					// если блок находится в стилевом элементе, то переносим всех потомков на уровень выше
					me.upChildren(el);
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
		 * Нормализует элемент уровня абзаца.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		normalizeStyleHolder: function (el)
		{
			var me = this,
				parent = el.parent,
				normalize = false;

			if (el.isStyleHolder)
			{
				// абзац

				if (el.isEmpty() && !el.first())
				{
					// удаляем пустой абзац без br
					parent.remove(el);
					normalize = true;
				}
				else if (parent.isStyleType)
				{
					// если абзац находится в стилевом элементе, то переносим всех потомков на уровень выше
					me.upChildren(el);
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
		 * Нормализует стилевой элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		normalizeStyle: function (el)
		{
			var me = this,
				parent = el.parent,
				normalize = false;

			if (el.isStyleType && !el.isStyleHolder)
			{
				// стилевой элемент

				if (el.isEmpty())
				{
					// пустой элемент

					if (!parent.isEmpty())
					{
						// если родительский элемент не пустой, то удаляем пустой элемент
						parent.remove(el);
						normalize = true;
					}
				}
				else if (!parent.getStyleHolder() && !parent.isStyleHolder)
				{
					// помещаем все стилевые элементы в абзац, если они находятся не в стилевом элементе или абзаце
					me.moveElsToNewHolder(el);
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
		 * Нормализует текстовый элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		normalizeText: function (el)
		{
			var me = this,
				parent = el.parent,
				normalize = false;

			if (el.isText)
			{
				// текстовый элемент

				if (!parent.isStyleType)
				{
					// помещаем текст в абзац, если он находится не в стилевом элементе
					me.moveElsToNewHolder(el);
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
		},

		/**
		 * @private
		 * Переносит всех потомков на уровень выше, а опустевший элемент удаляет.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		upChildren: function (el)
		{
			var me = this,
				parent = el.parent;

			while (el.first())
			{
				parent.insertBefore(el.first(), el);
			}

			parent.remove(el);
		},

		/**
		 * @private
		 * Помещает элемент и все сиблинги в новый абзац.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		moveElsToNewHolder: function (el)
		{
			var me = this,
				parent = el.parent,
				pasteProxy = me.pasteProxy,
				manager = pasteProxy.manager,
				factory = manager.getFactory(),
				els = {};

			els.p = factory.createElement('p');
			els.next = el;

			//console.log('--', parent.getXml());
			//console.log('---', els.next.getXml());

			while (els.next)
			{
				els.temp = els.next.next();

				if (els.next.isBr)
				{
					// если встречаем перенос строки, то удаляем его и закрываем абзац
					parent.remove(els.next);
					els.next = els.temp;
					break;
				}

				if (!els.next.isStyleHolder)
				{
					els.t = els.p.last();

					if (els.t && els.t.isText && els.next.isText)
					{
						// объединяем текстовые сиблинги в один элемент
						els.t.setText(els.t.text + els.next.text);
					}
					else
					{
						// клоинруем элемент
						els.clone = els.next.clone();

						// добавляем в абзац
						els.p.add(els.clone);
					}

					parent.remove(els.next);
				}

				els.next = els.temp;

				if (els.next && els.next.isStyleHolder)
				{
					// если встретили следующий абзац, то закрываем текущий абзац
					els.next = els.next.prev() || els.next;
					break;
				}
			}

			if (els.p.first())
			{
				if (els.next)
				{
					// вставляем абзац перед следующим сиблингом
					parent.insertBefore(els.p, els.next);
				}
				else
				{
					// добавляем в конец
					parent.add(els.p);
				}
			}
		}
	}
);