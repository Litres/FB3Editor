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
		 * Проверяет имя элемента по схеме.
		 * @param {String} name Имя элемента.
		 * @param {Array} elements Список имен дочерних элементов.
		 * @return {Boolean} Успешность проверки имени элемента по схеме.
		 */
		verify: function (name, elements)
		{
			var me = this,
				res = true,
				srcEls = elements,
				seq,
				el,
				nameEl;

			// отладочные сообщения
			me.disableDebug = true;

			el = me.getElement(name);
			if (!el)
			{
				return false;
			}
			seq = el.sequence ? Ext.clone(el.sequence) : null;
			me.disableDebug || console.log('VERIFY name, srcEls, el', name, srcEls, el);
			while (srcEls.length)
			{
				nameEl = srcEls[0];
				me.disableDebug || console.log('======================== (nameEl, seq, srcEls)', nameEl, seq, srcEls);
				if (!me.checkSequence(seq, srcEls))
				{
					me.disableDebug || console.log('=== ERROR VERIFY === (nameEl, seq, srcEls)', nameEl, seq, srcEls);
					return false;
				}
			}

			return res;
		},

		/**
		 * Проверяет имя элемента по sequence.
		 * @param {Array} seq Элементы sequence.
		 * @param {Array} srcEls Список имен дочерних элементов.
		 * @return {Boolean} Успешность проверки имени элемента.
		 */
		checkSequence: function (seq, srcEls)
		{
			var me = this,
				res = false,
				item,
				name,
				nextName;

			me.disableDebug || console.log('--- SEQUENCE --- (name, seq, srcEls)', srcEls[0], seq, srcEls);

			// перебираем всю последовательность sequence
			while (seq.length)
			{
				name = srcEls[0];
				item = seq[0];
				if (item)
				{
					if (item.element)
					{
						// проверяем имя элемента на прямое совпадение с element
						nextName = srcEls.length > 1 ? srcEls[1] : false;
						res = me.checkElement(name, nextName, item.element, seq);
						if (res)
						{
							// если элемент прошел проверку, то удаляем его из списка и проверяем следующий
							srcEls.splice(0, 1);
						}
					}
					else if (item.choice)
					{
						// проверяем все последующие имена элементов на choice
						while (name && (res = me.checkChoice(name, item.choice)))
						{
							// если имя элемента совпало, то удаляем его из списка и проверяем следующее
							me.disableDebug || console.log('< OK > sequence choice (name, choice)', name, item.choice);
							srcEls.splice(0, 1);
							name = srcEls.length ? srcEls[0] : false;
						}

						// убираем из последовательности choice
						seq.splice(0, 1);
					}
				}
			}

			return res;
		},

		/**
		 * Проверяет элемент на прямое совпадение с element.
		 * @param {String} name Имя элемента.
		 * @param {String|Boolean} nextName Следующее имя элемента.
		 * @param {Object} element Элемент схемы.
		 * @param {Array} items Элементы sequence.
		 * @return {Boolean} Успешность проверки имени элемента.
		 */
		checkElement: function (name, nextName, element, items)
		{
			var me = this,
				res = false,
				el;

			// данные проверяемого элемента element
			el = Ext.Object.getValues(element)[0];
			me.disableDebug || console.log('--- ELEMENT --- (name, nextName, el, items)', name, nextName, el, items);

			if (el.name === name || el.ref === name)
			{
				// совпадающее имя элемента
				me.disableDebug || console.log('< OK > sequence element (el, nextName)', el, nextName);
				res = true;
				if (el.maxOccurs && el.maxOccurs === 'unbounded' && nextName === name)
				{
					// бесконечное количество элементов
					// не убираем из последовательности element
				}
				else if (el.maxOccurs && Number(el.maxOccurs) > 1 && nextName === name)
				{
					// ограниченное количество элементов
					// не убираем из последовательности element
					el.maxOccurs = Number(el.maxOccurs) - 1;
				}
				else
				{
					// убираем из последовательности element
					items.splice(0, 1);
				}
			}
			else if (el.minOccurs && Number(el.minOccurs) === 0)
			{
				// пропускаем проверку необязательного элемента
				// убираем из последовательности element
				items.splice(0, 1);
			}
			else
			{
				// убираем из последовательности element
				items.splice(0, 1);
			}

			return res;
		},

		/**
		 * Проверяет имя элемента на совпадение по choice.
		 * @param {String} name Имя элемента.
		 * @param {Object} choice Элемент с choice.
		 * @return {Boolean} Успешность проверки имени элемента.
		 */
		checkChoice: function (name, choice)
		{
			var me = this,
				res = false,
				attrs;

			me.disableDebug || console.log('+++ CHOICE +++ (name, choice)', name, choice);
			//attrs = choice.attributes || {};

			// проверяем имя элемента на совпадение с choice.elements
			res = Ext.Array.findBy(
				choice.elements,
			    function (element)
			    {
				    return element[name];
			    }
			);

			if (res)
			{
				// если имя элемента совпало, то сразу выходим из процедуры проверки по choice
				return true;
			}

			if (choice.sequence)
			{
				// проверяем имя элемента на совпадение в последовательности choice.sequence
				res = me.checkChoiceSequence(name, choice.sequence);
			}

			return res;
		},

		/**
		 * Проверяет имя элемента на совпадение в choice.sequence.
		 * @param {String} name Имя элемента.
		 * @param {Array} choiceSeq Элементы choice.sequence.
		 * @return {Boolean} Успешность проверки имени элемента.
		 */
		checkChoiceSequence: function (name, choiceSeq)
		{
			var me = this,
				res = false;

			me.disableDebug || console.log('+++ CHOICE SEQUENCE +++ (name, choiceSeq)', name, choiceSeq);

			// ищем любое совпадение в choice.sequence
			res = Ext.Array.findBy(
				choiceSeq,
			    function (item)
			    {
				    if (item.element)
				    {
					    // проверяем имя элемента на прямое совпадение с element
					    if (item.element[name])
					    {
						    me.disableDebug || console.log('-< OK >- choice sequence element (name, element)', name, item.element);
						    return true;
					    }
				    }
				    else if (item.choice)
				    {
					    // проверяем имя элемента в choice
					    if (me.checkChoice(name, item.choice))
					    {
						    me.disableDebug || console.log('+< OK >+ choice sequence choice (name, choice)', name, item.choice);
						    return true;
					    }
				    }

				    return false;
			    }
			);

			return res;
		}
	}
);