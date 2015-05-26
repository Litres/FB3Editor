/**
 * Фабрика для схемы текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.schema.Factory',
	{
		singleton: 'true',

		/**
		 * @property {Array} Список определенных типов.
		 */
		definedTypes: [],

		/**
		 * @private
		 * @property {Object} Список отложенных типов для определения.
		 */
		_deferredTypes: {},

		/**
		 * Создает новый элемент.
		 * @param {String} name Название элемента.
		 * @param {Object} [options] Опции элемента.
		 * @return {Object} Элемент схемы.
		 */
		createElement: function (name, options)
		{
			var me = this,
				n = name,
				opts = options,
				nameEl,
				el,
				cls;

			if (Ext.isEmpty(n))
			{
				throw Error('Невозможно создать элемент схемы текста. Передано пустое назавние элемента.');
			}
			try
			{
				n = n.replace(/-([a-z])/g, '$1');
				n = Ext.String.capitalize(n);
				nameEl = 'FBEditor.editor.schema.' + n + 'Element';
				if (!opts.extend)
				{
					delete opts.extend;
				}
				else
				{
					opts.extend = 'FBEditor.editor.schema.body.' + opts.extend.substring(5);
				}
				//console.log(n);
				cls = {
					constructor: function ()
					{
						var me = this,
							cls = me.superclass;

						while (cls)
						{
							if (cls.elements)
							{
								me.elements = me.elements || [];
								me.elements = Ext.Array.merge(cls.elements, me.elements);
							}
							if (cls.choice)
							{
								me.choice = me.choice || {};
								me.choice = Ext.applyIf(me.choice, cls.choice);
							}
							if (cls.attributes)
							{
								me.attributes = me.attributes || {};
								me.attributes = Ext.applyIf(me.attributes, cls.attributes);
							}
							cls = cls.superclass;
						}
						Ext.Object.each(
							me.attributes,
						    function (name, item)
						    {
							    var typeCls;

							    if (item.type && /:/.test(item.type))
							    {
								    typeCls = 'FBEditor.editor.schema.body.' + item.type.substring(5);
								    item.type = Ext.create(typeCls);
								    //console.log(name, item);
							    }
						    }
						);
					}
				};
				cls = Ext.apply(opts, cls);

				// определяем и создаем класс элемента
				Ext.define(nameEl, cls);
				el = Ext.create(nameEl);
				//console.log(el);
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: 'Неопределенный элемент схемы текста: ' + nameEl, dump: e});
			}

			return el;
		},

		/**
		 * Определяет новый тип.
		 * @param {String} name Название типа.
		 * @param {Object} [options] Данные типа.
		 */
		defineType: function (name, options)
		{
			var me = this,
				definedTypes = me.definedTypes,
				deferredTypes = me._deferredTypes,
				n = name,
				opts = Ext.clone(options),
				nameType;

			if (Ext.isEmpty(n))
			{
				throw Error('Невозможно определить тип схемы текста. Передано пустое назавние типа.');
			}
			try
			{
				n = n.replace(/-([a-z])/g, '$1');
				nameType = 'FBEditor.editor.schema.body.' + n;
				//console.log(n);
				if (opts.extend)
				{
					opts.extend = 'FBEditor.editor.schema.body.' + opts.extend.substring(5);
					if (!Ext.Array.contains(definedTypes, opts.extend))
					{
						//console.log(opts.extend);
						deferredTypes[nameType] = {name: name, options: options};

						return;
					}
				}

				// определяем класс типа
				Ext.define(nameType, opts);

				// добавляем название типа в список
				definedTypes.push(nameType);
				//console.log(n, opts);

				delete deferredTypes[nameType];
				me._checkDeferredTypes();
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: 'Неопределенный тип схемы текста: ' + nameType, dump: e});
			}
		},

		/**
		 * @private
		 * Проверка опрделения отложенных типов.
		 */
		_checkDeferredTypes: function ()
		{
			var me = this,
				deferredTypes = me._deferredTypes;

			Ext.Object.each(
				deferredTypes,
			    function (key, item)
			    {
				    me.defineType(item.name, item.options);
			    }
			);
		}
	}
);