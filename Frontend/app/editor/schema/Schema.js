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
				schEl,
				schElements,
				schChoice,
				nameEl;

			schEl = me.getElement(name);
			if (!schEl)
			{
				return false;
			}
			schElements = schEl.elements ? Ext.clone(schEl.elements) : null;
			schChoice = schEl.choice ? Ext.clone(schEl.choice) : null;
			console.log('VERIFY name, elements, schEl', name, elements, schEl);
			while (srcEls.length)
			{
				nameEl = srcEls[0];
				if (!schElements)
				{
					res = false;
				}
				else if (res && schElements.length && !me.checkElement(nameEl, srcEls, schElements))
				{
					res = false;
				}
				if ((!schElements || schElements && !schElements.length) && schChoice)
				{
					res = true;
					if (schChoice && !me.checkChoice(nameEl, schChoice))
					{
						return false;
					}
				}
				srcEls.splice(0, 1);
			}

			return res;
		},

		/**
		 * Проверяет элемент по списку elements.
		 * @param {String} name Имя элемента.
		 * @param {Array} srcEls Список исходных элементов.
		 * @param {Array} schElements Список элементов схемы.
		 * @return {Boolean} Успешность проверки элемента.
		 */
		checkElement: function (name, srcEls, schElements)
		{
			var res = false,
				pos = 0,
				el;

			console.log('name, srcEls, schElements', name, srcEls, schElements);
			while (pos < schElements.length)
			{
				el = Ext.Object.getValues(schElements[pos])[0];
				if (el.name === name)
				{
					// совпадающий элемент
					console.log('ok el, pos', el, pos);
					schElements.splice(pos, 1);

					return true;
				}
				if (el.minOccurs && Number(el.minOccurs) === 0)
				{
					// пропускаем проверку необязательного элемента
					//console.log('cancel el, pos', el, pos);
					schElements.splice(pos, 1);
				}
				else
				{
					pos++;
				}
			}

			return res;
		},

		/**
		 * Проверяет элемент по выбору choice.
		 * @param {String} name Имя элемента.
		 * @param {Object} schChoice Элементы choice.
		 * @return {Boolean} Успешность проверки элемента.
		 */
		checkChoice: function (name, schChoice)
		{
			var me = this,
				res,
				el;

			console.log('name, schChoice', name, schChoice);
			el = Ext.Array.findBy(
				schChoice.elements,
			    function (item)
			    {
				    return item[name];
			    }
			);
			res = el ? true : false;
			if (!res && schChoice.sequence && me.checkSequence(name, schChoice.sequence))
			{
				res = true;
			}

			return res;
		},

		/**
		 * Проверяет элемент по sequence.
		 * @param {String} name Имя элемента.
		 * @param {Object} schSequence Элементы sequence.
		 * @return {Boolean} Успешность проверки элемента.
		 */
		checkSequence: function (name, schSequence)
		{
			var me = this,
				res = false;

			console.log('name, schSequence', name, schSequence);
			if (schSequence.choice && me.checkChoice(name, schSequence.choice))
			{
				res = true;
			}

			return res;
		},

		/**
		 * Проверяет предыдущий элемент.
		 * @param {String} name Имя элемента.
		 * @param {String} prevName Имя предыдущего элемента.
		 * @param {Node} node Узел после которого необходимо вставить элемент.
		 * @return {Boolean} Соответствует ли схеме предыдущий элемент.
		 */
		checkPrevious: function (name, prevName, node)
		{
			var me = this,
				sch,
				els,
				el,
				parentName,
				parentEl,
				count,
				index,
				res = false;

			parentEl = node.parentNode.getElement();
			parentName = parentEl.xmlTag;
			sch = me.getElement(parentName);
			els = sch.elements;
			if (els.length)
			{
				el = Ext.Array.findBy(
					els,
					function (item, i)
					{
						index = i;

						return item[name];
					}
				);
				if (el)
				{
					console.log(els, el, index);
					// если элемент такой же как и предыдущий
					if (name === prevName)
					{
						if (el[prevName].maxOccurs && el[prevName].maxOccurs === 'unbounded')
						{
							// бесконечное количество элементов
							res = true;
						}
						else if (el[prevName].maxOccurs)
						{
							// ограниченное количество элементов
							count = 1 + me.getPrevCount(prevName, node) + me.getNextCount(prevName, node);
							res = count < Number(el[prevName].maxOccurs) ? true : false;
						}
					}
				}
			}

			return res;
		},

		/**
		 * @private
		 * Возвращает количество предыдущих элементов.
		 * @param {String} name Имя элемента.
		 * @param {Node} node Узел элемента.
		 * @return {Number} Количество предыдущих элементов.
		 */
		getPrevCount: function (name, node)
		{
			var count = 0,
				prev = node.previousSibling;

			while (prev && prev.getElement().xmlTag === name)
			{
				count++;
				prev = prev.previousSibling;
			}

			return count;
		},

		/**
		 * @private
		 * Возвращает количество следующих элементов.
		 * @param {String} name Имя элемента.
		 * @param {Node} node Узел элемента.
		 * @return {Number} Количество следующих элементов.
		 */
		getNextCount: function (name, node)
		{
			var count = 0,
				next = node.nextSibling;

			while (next && next.getElement().xmlTag === name)
			{
				count++;
				next = next.nextSibling;
			}

			return count;
		}
	}
);