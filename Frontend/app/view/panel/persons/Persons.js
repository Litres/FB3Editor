/**
 * Панель для отображения данных персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.persons.Persons',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.persons.PersonsController',
			'FBEditor.view.panel.persons.PersonsStore'
		],
		controller: 'panel.persons',
		xtype: 'panel-persons',
		cls: 'panel-persons',
		minWidth: 300,

		listeners: {
			loadData: 'onLoadData'
		},

		/**
		 * @property {Function} Вызывается при выборе персоны из списка.
		 * @param {Object} Данные персоны.
		 */
		selectFn: Ext.emptyFn,

		/**
		 * @property {Object} Индикатор загрузки.
		 */
		loadMask: null,

		/**
		 * @private
		 * @property {Object} Индикатор загрузки по умолчанию.
		 */
		defaultLoadMask: null,

		/**
		 * @private
		 * @property {Number} Счетчик потворных запрос поиска в случае нулевого результата, поменяв местами фамилию и
		 * имя.
		 */
		countRepeatRequest: 0,

		/**
		 * @property {Object} Исходные параметры запроса.
		 */
		params: null,

		translateText: {
			creator: 'Создатель',
			copyrighter: 'Правообладатель',
			no: 'нет',
			notFound: 'Ничего не найдено',
			loading: 'Загрузка...',
			link: 'Страница редактирования'
		},

		initComponent: function ()
		{
			var me = this,
				store;

			// хранилище
			store = Ext.create('FBEditor.view.panel.persons.PersonsStore');
			store.setCallback(
				{
					fn: me.load,
					scope: me
				}
			);
			me.store = store;

			// индикатор загрузки
			me.loadMask = {
				msg: me.translateText.loading,
				margin: '25 0 0 0'
			};
			me.defaultLoadMask = Ext.clone(me.loadMask);

			me.callParent(arguments);
		},

		/**
		 * Устанавливает индикатор загрузки.
		 * @param {Object} loadMask
		 */
		setLoadMask: function (loadMask)
		{
			var me = this,
				mask = loadMask || me.defaultLoadMask;

			me.loadMask = Ext.clone(mask);
		},

		/**
		 * Загружает данные персон в панель.
		 * @event afterLoad Вбрасывается после загрузки данных.
		 * @param {Array} data Данные персон.
		 */
		load: function (data)
		{
			var me = this;

			//console.log('load', me.countRepeatRequest, me.params, data);
			me.setLoading(false);
			me.fireEvent('afterLoad', data);

			if (me.countRepeatRequest < 3)
			{
				// увеличиваем счетчик запросов
				me.countRepeatRequest++;

				if (data && data.length)
				{
					// обнуляем счетчик запросов
					me.countRepeatRequest = 0;

					Ext.Array.each(
						data,
						function (item)
						{
							var person,
								personItems,
								booksTotal;

							if (item)
							{
								personItems = [
									{
										xtype: 'component',
										html: me.getHtmlPerson(item),
										afterRender: function ()
										{
											me.afterRenderPerson(this);
										}
									}
								];

								if (item.arts && item.arts.length)
								{
									// книги

									booksTotal = item.arts.length >= 30 ? '29+' : item.arts.length;

									personItems.push(
										{
											xtype: 'fieldset',
											title: 'Книги (' + booksTotal + ')',
											collapsible: true,
											collapsed: true,
											html: me.getHtmlBooks(item)
										}
									);
								}

								person = {
									xtype: 'container',
									width: '100%',
									cls: 'panel-persons-item',
									items: personItems
								};

								me.add(person);
							}
						}
					);
				}
				else
				{
					// делаем повторные запросы, изменяя параметры поиска по ФИО
					me.repeatRequestSearch();

					//me.noPersons();
				}
			}
			else
			{
				me.countRepeatRequest = 0;
				me.noPersons();
			}

			me.doLayout();
		},

		/**
		 * Удаляет все данные персон.
		 */
		clean: function ()
		{
			var me = this;

			Ext.suspendLayouts();
			me.removeAll();
			Ext.resumeLayouts();
			me.doLayout();
		},

		/**
		 * Прерывает поиск.
		 * @event abort Вбрасывается после прерывания запроса.
		 */
		abort: function ()
		{
			var me = this,
				store = me.store;

			me.setLoading(false);
			store.abort();
			me.fireEvent('abort');
		},

		/**
		 * Вызывается после добавления персоны в контейнер.
		 */
		afterRenderPerson: function (personCmp)
		{
			var me = this,
				fio;

			// добалвяем обработчик события при клике по ФИО
			fio = personCmp.getEl().query('.panel-persons-item-fio')[0];
			fio.addEventListener(
				'click',
			    function ()
			    {
				    var record,
					    personId;

				    personId = this.getAttribute('person-id');
				    record = me.store.getRecord('id', personId);
				    me.selectFn(record);
			    }
			);
		},

		/**
		 * Делает повторный запрос поиска, изменяя параметры ФИО.
		 */
		repeatRequestSearch: function ()
		{
			var me = this,
				params = Ext.clone(me.params);

			//console.log('me.countRepeatRequest', me.countRepeatRequest, params);

			if (me.countRepeatRequest == 1)
			{
				if (params.first)
				{
					// меняем местами фамилию и имя
					params.tmp = params.first;
					params.first = params.last;
					params.last = params.tmp;
					delete params.tmp;
				}
				else
				{
					me.countRepeatRequest++;
				}
			}

			if (me.countRepeatRequest == 2)
			{
				// ищем только по первому слову, считая, что это фамилия
				params = {
					last: params.last
				};
			}

			//console.log('params', params);
			me.fireEvent('loadData', params);
		},

		/**
		 * @private
		 * Выводит сообщение о том, что ничего не найдено.
		 */
		noPersons: function ()
		{
			var me = this;

			me.clean();

			if (me.loadMask)
			{
				// если есть индикатор загрузки, то показываем надпись
				me.add(
					{
						border: true,
						layout: 'fit',
						style: 'text-align: center',
						html: me.translateText.notFound
					}
				);
			}
		},

		/**
		 * @private
		 * Возвращает html для отображения данных персоны.
		 * @param {Object} data Данные персоны.
		 * @return {String} Строка html.
		 */
		getHtmlPerson: function (data)
		{
			var me = this,
				names = me.store.params,
				tpl,
				html;

			tpl = new Ext.XTemplate(
				'<div class="panel-persons-item-common " style="background-color: {bgcolor}">' +
				'   <div class="panel-persons-item-fio" person-id="{id}">' +
				'       <span style="color: {link_color}">{fio}</span>' +
				'   </div>' +
				'   <div class="panel-persons-item-copyrighters" title="' + me.translateText.copyrighter + '"' +
				'       style="color: {link_color}">' +
				'   <tpl if="copyrighters">' +
				'       <tpl for="copyrighters">' +
				'           <span>{full_name}</span><br />' +
				'       </tpl>' +
				'   <tpl else>(' + me.translateText.no + ')</tpl>' +
				'   </div>' +
				'   <div class="panel-persons-item-creator" title="' + me.translateText.creator + '"' +
				'       style="color: {link_color}">{creator_login}</div>' +
				'   <div class="panel-persons-item-desc">{description}</div>' +
				'   <div class="panel-persons-item-time">{last_action_time}</div>' +
				'   <a class="panel-persons-item-link" target="_blank"' +
				'           title="' + me.translateText.link + '"' +
				'           href="https://hub.litres.ru/pages/edit_subject/?subject={id}">' +
				'       <i class="fa fa-external-link"></i>' +
				'   </a>' +
				'</div>'
			);

			if (names)
			{
				data.last_name = data.last_name && names.last ?
				                 data.last_name.replace(new RegExp('^(' + names.last + ')', 'i'), '<b>$1</b>') :
				                 data.last_name;
				data.first_name = data.first_name && names.first ?
				                 data.first_name.replace(new RegExp('^(' + names.first + ')', 'i'), '<b>$1</b>') :
				                 data.first_name;
				data.middle_name = data.middle_name && names.middle ?
				                  data.middle_name.replace(new RegExp('^(' + names.middle + ')', 'i'), '<b>$1</b>') :
				                  data.middle_name;
			}

			data.fio = '';
			data.fio += data.last_name ? data.last_name + ' ' : '';
			data.fio += data.first_name ? data.first_name + ' ' : '';
			data.fio += data.middle_name ? data.middle_name : '';
			data.fio = data.fio.trim();

			data.bgcolor = 'white';
			data.bgcolor = Number(data.unchecked) ? '#f8f8f8' : data.bgcolor;
			data.bgcolor = data.creator_login == 'reader_release' ? '#F3DBDA' : data.bgcolor;
			data.bgcolor = data.copyrighters ? '#FFFD9A' : data.bgcolor;

			data.link_color = '#2e7ed5';
			data.link_color = Number(data.unchecked) ? 'gray' : data.link_color;

			html = tpl.apply(data);

			return html;
		},

		/**
		 * @private
		 * Возвращает html для отображения данных о книгах персоны.
		 * @param {Object} data Данные персоны.
		 * @return {String} Строка html.
		 */
		getHtmlBooks: function (data)
		{
			var me = this,
				tpl,
				html;

			tpl = new Ext.XTemplate(
				'<ul class="panel-persons-item-books">' +
				'<tpl for="arts">' +
				'<li class="panel-persons-item-book" style="background-color: {bgcolor}">' +
				'   <a style="color: {link_color}" target="_blank" ' +
				'       href="https://hub.litres.ru/pages/edit_object/?art={id}">{name}</a>' +
				'</li>' +
				'</tpl>' +
			    '</ul>'
			);

			Ext.Array.each(
				data.arts,
			    function (item)
			    {
				    item.bgcolor = 'white';
				    item.bgcolor = Number(item.unchecked) ? '#f8f8f8' : item.bgcolor;
				    item.bgcolor = Number(item.sell_open) ? '#FFFD9A' : item.bgcolor;

				    item.link_color = '#2e7ed5';
				    item.link_color = Number(data.unchecked) ? 'gray' : item.link_color;
			    }
			);

			html = tpl.apply(data);

			return html;
		}
	}
);