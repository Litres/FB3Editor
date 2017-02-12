/**
 * Абстрактный прокси элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.model.AbstractProxy',
	{
		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Вставляемый элемент.
		 */
		el: null,

		/**
		 * @private
		 * @property {FBEditor.editor.pasteproxy.ModelProxy} Прокси модели.
		 */
		modelProxy: null,

		constructor: function (data)
		{
			var me = this;

			me.el = data.el;
			me.modelProxy = data.modelProxy;
		},

		/**
		 * Нормализует элемент.
		 * @return {Boolean} Произошли ли изменения модели.
		 */
		normalize: function ()
		{
			throw Error('Необходима реализация метода FBEditor.editor.pasteproxy.model.AbstractProxy#normalize()');
		},

		/**
		 * @protected
		 * Помещает элемент и все сиблинги в новый абзац.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 */
		moveElsToNewHolder: function (el)
		{
			var me = this,
				parent = el.parent,
				modelProxy = me.modelProxy,
				pasteProxy = modelProxy.pasteProxy,
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
					parent.remove(els.next);

					if (els.t && els.t.isText && els.next.isText)
					{
						// объединяем текстовые сиблинги в один элемент
						els.t.setText(els.t.text + els.next.text);
					}
					else
					{
						// клонируем элемент
						//els.clone = els.next.clone();

						// добавляем в абзац
						els.p.add(els.next);
					}

					//parent.remove(els.next);
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
		},

		/**
		 * @protected
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
		 * @protected
		 * Проверяет элемент по схеме, относительно родительского элемента.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 * @return {Boolean} Соответствует ли элемент схеме.
		 */
		checkSchema: function (el)
		{
			var me = this,
				parent = el.parent,
				modelProxy = me.modelProxy,
				pasteProxy = modelProxy.pasteProxy,
				manager = pasteProxy.manager,
				schema = manager.getSchema(),
				parentName = parent.getName(),
				isChild;

			// является ли элемент допустимым
			isChild = parentName === 'body' ? true : schema.isChild(parent.getName(), el.getName());

			return isChild;
		}
	}
);