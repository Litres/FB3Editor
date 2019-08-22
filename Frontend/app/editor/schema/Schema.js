/**
 * Правила проверки элементов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.schema.Schema',
	{
		requires: [
			'FBEditor.xsd.Fb3body',
			'FBEditor.xsd.desc.Annotation',
			'FBEditor.xsd.desc.Bibliodescription',
			'FBEditor.xsd.desc.History',
			'FBEditor.xsd.desc.Preamble',
			'FBEditor.xsl.SchemaBody',
		    'FBEditor.editor.schema.Factory'
		],

		/**
		 * @property {Object} Элементы схемы в виде json.
		 */
		elements: null,
		
		/**
		 * @private
		 * @property {String} Схема текста.
		 */
		_xsd: '',

		/**
		 * @private
		 * @property {Object[]} Очередь функций обратного вызова при получении ответа после проверки схемы.
		 * Самая первая функция должна быть выполнена в первую очередь.
		 * @property {Function} Object.fn Функция.
		 * @property {Object} Object.scope Хозяин функции.
		 * @property {Object} [Object.scopeData] Дополнительные данные.
		 */
		callback: [],

		/**
		 * @property {Boolean} Показывать ли отладочные сообщения в консоли.
		 */
		disableDebug: true,

		/**
		 * @private
		 * @property {Object} Кэш схемы элементов в виде xml.
		 */
		//xsd: {},

		/**
		 * @param {String} schemaName Название схемы.
		 */
		constructor: function (schemaName)
		{
			var me = this,
				schName = schemaName,
				json,
				xsl,
				xsd,
				xsdJson,
				cse,
				dse,
				elements;

			// сокращенная форма метода создания элемента схемы
			cse = function (name, options)
			{
				options.schemaName = schName;
				return FBEditor.editor.schema.Factory.createElement(name, options);
			};

			// сокращенная форма метода для определения типа схемы
			dse = function (name, options)
			{
				options.schemaName = schName;
				return FBEditor.editor.schema.Factory.defineType(name, options);
			};
			
			try
			{
				// получаем json схемы
				json = me.getJson(schName);
				
				me._xsd = me.createXsd(schName);
				
				if (!json)
				{
					// если json схемы отсутствует, то получаем его из xsd
					
					xsd = me._xsd.replace(/<schema.*?>/, "<schema>");
					xsl = FBEditor.xsl.SchemaBody.getXsl();
					xsdJson = FBEditor.util.xml.Jsxml.trans(xsd, xsl);
					//console.log(xsdJson);
					
					// преобразование строки в объект
					eval(xsdJson);
					me.elements = elements;
					console.log(JSON.stringify(me.elements));
				}
				else
				{
					me.elements = json;
				}
				
				Ext.log({msg: 'Элементы схемы ' + schName, level: 'info', dump: me.elements});
			}
			catch (e)
			{
				Ext.log({level: 'error', msg: e, dump: e});
				Ext.Msg.show(
					{
						title: 'Ошибка',
						message: 'Невозможно инициализировать схему ' + schName,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
			}
		},

		/**
		 * Проверяет xml по схеме.
		 * @param opts Данные.
		 * @param {String} opts.xml Строка xml, которую необходимо проверить по схеме.
		 * @param {Function} opts.callback Функция обратного вызова, которая получит результат проверки.
		 * @param {Object} opts.scope Хозяин функции обратного вызова.
		 * @param {Object} [opts.scopeData] Дополнительные данные.
		 */
		validXml: function (opts)
		{
			var me = this,
				manager = FBEditor.webworker.Manager,
				master = manager.getMaster('xmllint'),
				data;

			data = {
				xml: opts.xml,
				xsd: me._xsd,
				xmlFileName: 'body.xml',
				schemaFileName: 'fb3_body.xsd'
			};

			// сохраняем колбэк в очереди вызовов
			opts.scopeData = opts.scopeData || {};
			me.callback.push({fn: opts.callback, scope: opts.scope, scopeData: opts.scopeData});

			master.post(data, me.messageValid, me);
		},

		/**
		 * Определяет является ли элемент потомком родителя.
		 * @param {String} parent Имя родителя.
		 * @param {String} child Имя потомка.
		 * @return {Boolean}
		 */
		isChild: function (parent, child)
		{
			var me = this,
				children = me.getChildrenForElement(parent),
				isChild;

			//console.log(parent, children);
			isChild = Ext.Array.contains(children, child);

			return isChild;
		},

		/**
		 * Возвращает список прямых дочерних элементов для элемента.
		 * @param {String} name Имя элемента, для которого необходимо вернуть дочерние элементы.
		 * @return {Array|false} Дочерние элементы.
		 */
		getChildrenForElement: function (name)
		{
			var me = this,
				children = [],
				el;

			el = me.getElement(name);

			if (el)
			{
				// перебираем элементы выбора
				if (el.choice && el.choice.elements)
				{
					Ext.Array.each(
						el.choice.elements,
						function (item)
						{
							var name = Ext.Object.getKeys(item)[0];

							children.push(name);
						}
					);
				}

				if (el.sequence.length)
				{
					// перебираем элементы последовательности
					Ext.Array.each(
						el.sequence,
						function (item)
						{
							var name;

							if (item.element)
							{
								name = Ext.Object.getKeys(item.element)[0];
								children.push(name);
							}

							if (item.choice)
							{
								// перебираем элементы выбора в элементе последовательности
								Ext.Array.each(
									item.choice.elements,
									function (itemChoice)
									{
										var name;

										name = Ext.Object.getKeys(itemChoice)[0];
										children.push(name);
									}
								);
								
								Ext.Array.each(
									item.choice.sequence,
									function (itemSequence)
									{
										var name;
										
										if (itemSequence.element)
										{
											name = Ext.Object.getKeys(itemSequence.element)[0];
											children.push(name);
										}
										else if (itemSequence.choice)
										{
											Ext.Array.each(
												itemSequence.choice.elements,
												function (itemChoice)
												{
													var name;
													
													name = Ext.Object.getKeys(itemChoice)[0];
													children.push(name);
												}
											);
										}
									}
								);
							}
						}
					);
				}
			}

			return children;
		},
		
		/**
		 * @private
		 * Возвращает json схемы в зависимости от переданного имени.
		 * @param {String} name Имя схемы.
		 * @return {Object}
		 */
		getJson: function (name)
		{
			var n = name,
				lastPart,
				nameXsd,
				json;
			
			if (Ext.isEmpty(n))
			{
				throw Error('Невозможно создать json схемы. Передано пустое назавние схемы.');
			}
			
			// преобразуем имя в реальное
			
			n = n.toLowerCase();
			n = n.replace(/-([a-z])/g, '$1');
			
			if (/:/.test(n))
			{
				// учитываем пространство имен
				
				n = n.split(':');
				
				// корректируем последнюю часть имени
				lastPart = n.pop();
				lastPart = Ext.String.capitalize(lastPart);
				n.push(lastPart);
				
				n = n.join('.');
			}
			else
			{
				// без пространства имен
				n = Ext.String.capitalize(n);
			}
			
			nameXsd = 'FBEditor.xsd.' + n;
			
			try
			{
				json = Ext.create(nameXsd);
				json = json.getJson ? json.getJson() : null;
			}
			catch (e)
			{
				json = '';
				
				Ext.log(
					{
						level: 'error',
						msg: 'Не найдена схема: ' + nameXsd,
						dump: e
					}
				);
			}
			
			//console.log(name, xsd);
			
			return json;
		},

		/**
		 * @private
		 * Создает и возвращает xml-схему в зависимости от переданного имени.
		 * @param {String} name Имя схемы.
		 * @return {String} Xml-схема.
		 */
		createXsd: function (name)
		{
			var n = name,
				lastPart,
				nameXsd,
				xsd;

			if (Ext.isEmpty(n))
			{
				throw Error('Невозможно создать схему. Передано пустое назавние схемы.');
			}

			// преобразуем имя в реальное

			n = n.toLowerCase();
			n = n.replace(/-([a-z])/g, '$1');

			if (/:/.test(n))
			{
				// учитываем пространство имен

				n = n.split(':');

				// корректируем последнюю часть имени
				lastPart = n.pop();
				lastPart = Ext.String.capitalize(lastPart);
				n.push(lastPart);

				n = n.join('.');
			}
			else
			{
				// без пространства имен
				n = Ext.String.capitalize(n);
			}

			nameXsd = 'FBEditor.xsd.' + n;

			try
			{
				xsd = Ext.create(nameXsd);
				xsd = xsd.getXsd();
			}
			catch (e)
			{
				xsd = '';

				Ext.log(
					{
						level: 'error',
						msg: 'Не найдена схема: ' + nameXsd,
						dump: e
					}
				);
			}
			
			//console.log(name, xsd);

			return xsd;
		},

		/**
		 * @private
		 * Получает результаты проверки от xmllint и вызывает колбэк.
		 * @param response Результаты провекри по схеме.
		 * @param {Boolean} response.res Прошла ли проверка.
		 * @param {String} response.valid Сообщение.
		 */
		messageValid: function (response)
		{
			var me = this,
				data = response.data,
				callback;

			callback = me.getCallback();

			!callback.scopeData.debug || console.log('xmllint', data.res, data.valid, data);
			//console.log('xmllint', data.res, data.valid, data);

			if (callback)
			{
				callback.scopeData.loaded = data.loaded;
				callback.scopeData.response = data;
				callback.fn.call(callback.scope, data.res, callback.scopeData);
			}
		},

		/**
		 * @private
		 * Возвращает первый колбэк из очереди.
		 * @return {Function|null} Колбэк.
		 */
		getCallback: function ()
		{
			var me = this,
				callback = null;

			if (me.callback.length)
			{
				// первый колбэк
				callback = me.callback.splice(0, 1)[0];
			}

			return callback;
		},

		/**
		 * @private
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
		 * Возвращает данные аттрибутов для элемента.
		 * @param {String} name Имя элемента.
		 * @return {Object} Аттрибуты.
		 */
		getAttributes: function (name)
		{
			var me = this,
				el = me.getElement(name),
				attrs = {};

			if (el)
			{
				Ext.Object.each(
					el.attributes,
				    function (key, item)
				    {
					    if (item.name)
					    {
						    attrs[key] = item;
					    }
				    }
				);
			}

			return attrs;
		},

		/**
		 * @private
		 * Возвращает имя элемента схемы.
		 * @param {Object} el Элемент схемы.
		 * @return {String} Имя.
		 */
		getName: function (el)
		{
			return el.attributes.name;
		},
		
		/**
		 * Проверяет хэш по json-схеме.
		 * @param {Object} hash Хэш.
		 * @return {Boolean} Успешна ли проверка.
		 */
		verifyHash: function (hash)
		{
			var me = this,
				res = true,
				parentName,
				name,
				val;
			
			//console.log('verify', hash);
			
			name = Ext.Object.getKeys(hash)[0];
			val = hash[name];
			
			while (val)
			{
				parentName = Ext.Object.getKeys(val)[0];
				val = val[parentName];
				
				//console.log([parentName, name]);
				
				res = me.isChild(parentName, name);
				
				if (!res)
				{
					// как только встречается несоответствие вложенности элементов - выходим
					break;
				}
				
				name = parentName;
			}
			
			return res;
		},
		
		/**
		 * Возвращает хэш всей родительской цепочки элемента до корня.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 * @return {Object}
		 */
		getHash: function (el)
		{
			var me = this,
				parent = el.getParent(),
				name = el.getName(),
				hash = {},
				next;
			
			next = hash[name] = {};
			
			while (parent)
			{
				next = next || {};
				name = parent.getName();
				next = next[name] = false;
				parent = parent.getParent()
			}
			
			return hash;
		},

		/**
		 * Проверяет имя элемента по схеме.
		 * @param {String} name Имя элемента.
		 * @param {Array} elements Список имен дочерних элементов.
		 * @return {Boolean} Успешность проверки имени элемента по схеме.
		 */
		verify: function (name, elements, debug)
		{
			var me = this,
				res = true,
				srcEls = Ext.clone(elements),
				seq,
				choice,
				el,
				nameEl,
				disableDebug = debug ? false : me.disableDebug;

			el = me.getElement(name);

			if (!el)
			{
				return false;
			}

			seq = el.sequence.length ? Ext.clone(el.sequence) : null;
			choice = el.choice && el.choice.elements && el.choice.elements.length ? Ext.clone(el.choice) : null;

			disableDebug || console.log('VERIFY name, srcEls, el', name, srcEls, el);

			try
			{
				while (srcEls.length)
				{
					nameEl = srcEls[0];
					disableDebug || console.log('======================== (nameEl, seq, srcEls)', nameEl, seq, srcEls);
					if (seq && !me.checkSequence(seq, srcEls, debug))
					{
						disableDebug || console.log('=== ERROR VERIFY SEQ === (nameEl, seq, srcEls)', nameEl, seq, srcEls);
						return false;
					}
					if (choice)
					{
						if (!me.checkChoice(nameEl, choice, debug))
						{
							disableDebug || console.log('=== ERROR VERIFY CHOICE === (nameEl, choice, srcEls)', nameEl, choice, srcEls);
							return false;
						}
						srcEls.splice(0, 1);
					}
				}
			}
			catch (e)
			{
				disableDebug || console.log('=== THROW ERROR VERIFY === ', e);
				res = false;
			}

			return res;
		},

		/**
		 * Проверяет имя элемента по sequence.
		 * @param {Array} seq Элементы sequence.
		 * @param {Array} srcEls Список имен дочерних элементов.
		 * @return {Boolean} Успешность проверки имени элемента.
		 */
		checkSequence: function (seq, srcEls, debug)
		{
			var me = this,
				res = false,
				item,
				name,
				nextName,
				disableDebug = debug ? false : me.disableDebug;

			disableDebug || console.log('--- SEQUENCE --- (name, seq, srcEls)', srcEls[0], seq, srcEls);

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
						res = me.checkElement(name, nextName, item.element, seq, debug);
						if (res)
						{
							// если элемент прошел проверку, то удаляем его из списка и проверяем следующий
							srcEls.splice(0, 1);
						}
					}
					else if (item.choice)
					{
						// проверяем все последующие имена элементов на choice
						if (name)
						{
							while (name && (res = me.checkChoice(name, item.choice, debug)))
							{
								// если имя элемента совпало, то удаляем его из списка и проверяем следующее
								disableDebug || console.log('< OK > sequence choice (name, choice)', name, item.choice);
								srcEls.splice(0, 1);
								name = srcEls.length ? srcEls[0] : false;
							}
						}
						else
						{
							res = me.checkChoice(name, item.choice, debug);
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
		checkElement: function (name, nextName, element, items, debug)
		{
			var me = this,
				res = false,
				el,
				disableDebug = debug ? false : me.disableDebug;

			// данные проверяемого элемента element
			el = Ext.Object.getValues(element)[0];
			disableDebug || console.log('--- ELEMENT --- (name, nextName, el, items)', name, nextName, el, items);
			if (el.name && el.name === name || el.ref && el.ref === name)
			{
				// совпадающее имя элемента
				disableDebug || console.log('< OK > sequence element (el, nextName)', el, nextName);
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
			else if ((el.name || el.ref) && (!el.minOccurs || Number(el.minOccurs) !== 0))
			{
				// пропущен обязательный элемент
				items.splice(0, items.length);
			}
			else if (name === undefined)
			{
				if (el.minOccurs && Number(el.minOccurs) === 0)
				{
					// элемент не обязателен
					res = true;
					items.splice(0, 1);
				}
				else
				{
					// пропущен обязательный элемент
					items.splice(0, items.length);
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
		checkChoice: function (name, choice, debug)
		{
			var me = this,
				res = false,
				attrs,
				disableDebug = debug ? false : me.disableDebug;

			disableDebug || console.log('+++ CHOICE +++ (name, choice)', name, choice);
			attrs = choice.attributes || {};

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
				res = me.checkChoiceSequence(name, choice.sequence, debug);
			}

			return res;
		},

		/**
		 * Проверяет имя элемента на совпадение в choice.sequence.
		 * @param {String} name Имя элемента.
		 * @param {Array} choiceSeq Элементы choice.sequence.
		 * @return {Boolean} Успешность проверки имени элемента.
		 */
		checkChoiceSequence: function (name, choiceSeq, debug)
		{
			var me = this,
				res = false,
				disableDebug = debug ? false : me.disableDebug;

			disableDebug || console.log('+++ CHOICE SEQUENCE +++ (name, choiceSeq)', name, choiceSeq);

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
						    disableDebug || console.log('-< OK >- choice sequence element (name, element)', name, item.element);
						    return true;
					    }
				    }
				    else if (item.choice)
				    {
					    // проверяем имя элемента в choice
					    if (me.checkChoice(name, item.choice, debug))
					    {
						    disableDebug || console.log('+< OK >+ choice sequence choice (name, choice)', name, item.choice);
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