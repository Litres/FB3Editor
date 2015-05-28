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
				console.log('============================= (nameEl, seq, srcEls)', nameEl, seq, srcEls);
				if (!me.checkSequence(nameEl, seq, srcEls))
				{
					console.log('ERROR VERIFY', nameEl, seq, srcEls);
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
				item,
				pos = 0;

			console.log('--- SEQUENCE --- (name, seq, srcEls)', name, seq, srcEls);
			while (seq.length)
			{
				item = seq[pos];
				res = item && item.element ? me.checkElement(name, item.element, seq, srcEls) : res;
				if (item && item.choice)
				{
					res = me.checkChoice(name, item.choice, seq, srcEls);
					if (seq[pos + 1])
					{
						pos++;
					}
					else
					{
						return res;
					}
				}
				if (res)
				{
					return true;
				}
				if (!item)
				{
					console.log('RETURN!!! (res, name, seq, srcEls)', res, name, seq, srcEls);
					return srcEls.length ? true : res;
				}
			}

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
			console.log('+++ ELEMENT +++ (name, el, element, items, srcEls)', name, el, element, items, srcEls);
			if (el.name === name || el.ref === name)
			{
				// совпадающий элемент
				nextName = srcEls[1] ? srcEls[1] : null;
				console.log('<OK> (el, nextName)', el, nextName);
				res = true;
				if (el.maxOccurs && el.maxOccurs === 'unbounded' && nextName === name)
				{
					// бесконечное количество элементов
				}
				else if (el.maxOccurs && Number(el.maxOccurs) > 1 && nextName === name)
				{
					// ограниченное количество элементов
					el.maxOccurs = Number(el.maxOccurs) - 1;
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
		 * @param {Object} choice Элемент с choice.
		 * @return {Boolean} Успешность проверки элемента.
		 */
		checkChoice: function (name, choice, items, srcEls)
		{
			var me = this,
				res = false,
				els,
				item,
				el,
				attrs,
				nextName;

			console.log('___ CHOICE ____ (name, choice, items, srcEls)', name, choice, items, srcEls);
			nextName = srcEls[1] ? srcEls[1] : null;
			els = choice.elements;
			attrs = choice.attributes || {};
			while (!res && els.length)
			{
				item = els[0];
				el = Ext.Object.getValues(item)[0];
				el = Ext.apply(el, attrs);
				res = me.checkElement(name, item, els, srcEls);
			}
			if (!res && choice.sequence)
			{
				res = me.checkSequence(name, choice.sequence, srcEls);
			}
			/*if (res)
			{
				console.log('<<<OK choice>>> (name, choice, items, srcEls, nextName)', name, choice, items, srcEls, nextName);
				if (attrs.maxOccurs && attrs.maxOccurs === 'unbounded' && nextName === name)
				{
					// бесконечное количество элементов
				}
				else if (attrs.maxOccurs && Number(attrs.maxOccurs) > 1 && nextName === name)
				{
					// ограниченное количество элементов
					attrs.maxOccurs = Number(attrs.maxOccurs) - 1;
				}
				else if (nextName !== name)
				{
					items.splice(0, 1);
				}
			}
			else
			{
				items.splice(0, 1);
			}*/

			return res;
		}
	}
);