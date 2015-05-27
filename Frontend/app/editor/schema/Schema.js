/**
 * Правила проверки элементов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.schema.Schema',
	{
		requires: [
			'FBEditor.xsd.Body',
			'FBEditor.xsl.SchemaBody',
		    'FBEditor.editor.schema.Factory'
		],

		/**
		 * @property {Object} Элементы схемы.
		 */
		elements: null,

		constructor: function ()
		{
			var me = this,
				xsl,
				xsd,
				xsdJson,
				cse,
				dse,
				elements;

			// сокращенная форма метода создания элемента схемы
			cse = function (name, options)
			{
				return FBEditor.editor.schema.Factory.createElement(name, options);
			};

			// сокращенная форма метода для определения типа схемы
			dse = function (name, options)
			{
				return FBEditor.editor.schema.Factory.defineType(name, options);
			};

			try
			{
				xsd = FBEditor.xsd.Body.getXsd();
				xsl = FBEditor.xsl.SchemaBody.getXsl();
				xsdJson = FBEditor.util.xml.Jsxml.trans(xsd, xsl);
				//console.log(xsdJson);

				// преобразование строки в объект
				eval(xsdJson);
				me.elements = elements;
				console.log(elements);
			}
			catch (e)
			{
				Ext.log({level: 'error', msg: e, dump: e});
				Ext.Msg.show(
					{
						title: 'Ошибка',
						message: 'Невозможно инициализировать схему тела книги.',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
			}
		},

		/**
		 * Возвращает данные схемы для элемента.
		 * @param {String} name Название элемента.
		 * @return {Object} Данные схемы элемента.
		 */
		getElement: function (name)
		{
			var me = this,
				els;

			els = me.elements[name] ? me.elements[name] : null;

			return els;
		},

		/**
		 * Проверяет элемент по схеме.
		 * @param {String} name Имя элемента.
		 * @param {Array} elements Список имен дочерних элементов.
		 * @return {Boolean} Успешность проверки по схеме.
		 */
		verify: function (name, elements)
		{
			var me = this,
				res = true,
				srcEls = elements,
				seq,
				el,
				nameEl;

			el = me.getElement(name);
			if (!el)
			{
				return false;
			}
			seq = el.sequence ? Ext.clone(el.sequence) : null;
			console.log('VERIFY name, srcEls, el', name, srcEls, el);
			while (srcEls.length)
			{
				nameEl = srcEls[0];
				if (!me.checkSequence(nameEl, seq, srcEls))
				{
					return false;
				}
				srcEls.splice(0, 1);
			}

			return res;
		},

		/**
		 * Проверяет элемент по sequence.
		 * @param {String} name Имя элемента.
		 * @param {Array} seq Элементы sequence.
		 * @return {Boolean} Успешность проверки элемента.
		 */
		checkSequence: function (name, seq, srcEls)
		{
			var me = this,
				res = false,
				item;

			//console.log('name, seq', name, seq);
			while (seq.length)
			{
				item = seq[0];
				res = item.element ? me.checkElement(name, item.element, seq, srcEls) : res;
				if (item.choice)
				{
					res = me.checkChoice(name, item.choice, seq, srcEls);
				}
				if (res)
				{
					return true;
				}
			}
			console.log('ERROR VERIFY', name);

			return res;
		},

		/**
		 * Проверяет элемент по element.
		 * @param {String} name Имя элемента.
		 * @param {Object} element Элемент схемы.
		 * @param {Array} items Элементы sequence.
		 * @return {Boolean} Успешность проверки элемента.
		 */
		checkElement: function (name, element, items, srcEls)
		{
			var res = false,
				el,
				nextName;

			el = Ext.Object.getValues(element)[0];
			//console.log('name, el, items', name, el, items);
			if (el.name === name)
			{
				// совпадающий элемент
				nextName = srcEls[1] ? srcEls[1] : null;
				//console.log('ok el, nextName', el, nextName);
				res = true;
				if (el.maxOccurs && el.maxOccurs === 'unbounded' && nextName === name)
				{
					// бесконечное количество элементов
				}
				else
				{
					items.splice(0, 1);
				}
			}
			else if (el.minOccurs && Number(el.minOccurs) === 0)
			{
				// пропускаем проверку необязательного элемента
				//console.log('cancel el', el);
				items.splice(0, 1);
			}
			else
			{
				items.splice(0, 1);
			}

			return res;
		},

		/**
		 * Проверяет элемент по choice.
		 * @param {String} name Имя элемента.
		 * @param {Object} choice Элементы choice.
		 * @return {Boolean} Успешность проверки элемента.
		 */
		checkChoice: function (name, choice, items, srcEls)
		{
			var me = this,
				res = false,
				els,
				item;

			//console.log('name, choice', name, choice);
			els = choice.elements;
			while (els.length)
			{
				item = els[0];
				res = me.checkElement(name, item, els, srcEls);
				if (res)
				{
					return true;
				}
			}
			if (!res && choice.sequence && me.checkSequence(name, choice.sequence, srcEls))
			{
				res = true;
			}
			items.splice(0, 1);

			return res;
		}
	}
);