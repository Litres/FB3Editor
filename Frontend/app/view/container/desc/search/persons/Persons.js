/**
 * Контейнер для отображения данных персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.container.desc.search.persons.Persons',
	{
		extend: 'FBEditor.view.container.desc.search.Container',
		requires: [
			'FBEditor.view.container.desc.search.persons.PersonsController',
			'FBEditor.view.container.desc.search.persons.PersonsStore'
		],
		controller: 'container.desc.search.persons',
		xtype: 'container-desc-search-persons',
		cls: 'container-search-persons',

		/**
		 * @private
		 * @property {Object} Хранит исходные параметры запроса для повторного использования.
		 */
		params: null,

		/**
		 * @private
		 * @property {Number} Счетчик повторных запросов поиска в случае нулевого результата.
		 */
		countRepeatRequest: 0,

		translateText: {
			creator: 'Создатель',
			copyrighter: 'Правообладатель',
			no: 'нет',
			link: 'Страница редактирования',
			notFound: 'Ничего не найдено',
			searching: 'Поиск персон...'
		},

		createStore: function ()
		{
			return Ext.create('FBEditor.view.container.desc.search.persons.PersonsStore');
		},

		load: function (data)
		{
			var me = this;

			me.maskSearching(false);
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
										html: me.getHtmlItems(item),
										afterRender: function ()
										{
											me.afterRenderItem(this);
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
									cls: 'container-search-persons-item',
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
				}
			}
			else
			{
				me.countRepeatRequest = 0;
				me.notFound();
			}

			me.updateLayout();
		},

		/**
		 * @private
		 * Делает повторный запрос поиска, изменяя параметры ФИО.
		 */
		repeatRequestSearch: function ()
		{
			var me = this,
				params = Ext.clone(me.params);

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

			me.fireEvent('loadData', params);
		},

		/**
		 * @private
		 * Вызывается после добавления записи в контейнер.
		 * @param {Ext.Component} personCmp Компонент записи.
		 */
		afterRenderItem: function (personCmp)
		{
			var me = this,
				fio;

			// добалвяем обработчик события при клике по ФИО
			fio = personCmp.getEl().query('.container-search-persons-item-fio')[0];
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
		 * @private
		 * Возвращает html для отображения данных.
		 * @param {Object} data Данные.
		 * @return {String} Строка html.
		 */
		getHtmlItems: function (data)
		{
			var me = this,
				names = me.store.params,
				tpl,
				html;

			tpl = new Ext.XTemplate(
				'<div class="container-search-persons-item-common " style="background-color: {bgcolor}">' +
				'   <div class="container-search-persons-item-fio" person-id="{id}">' +
				'       <span style="color: {link_color}">{fio}</span>' +
				'   </div>' +
				'   <div class="container-search-persons-item-copyrighters" title="' + me.translateText.copyrighter + '"' +
				'       style="color: {link_color}">' +
				'   <tpl if="copyrighters">' +
				'       <tpl for="copyrighters">' +
				'           <span>{full_name}</span><br />' +
				'       </tpl>' +
				'   <tpl else>(' + me.translateText.no + ')</tpl>' +
				'   </div>' +
				'   <div class="container-search-persons-item-creator" title="' + me.translateText.creator + '"' +
				'       style="color: {link_color}">{creator_login}</div>' +
				'   <div class="container-search-persons-item-desc">{description}</div>' +
				'   <div class="container-search-persons-item-time">{last_action_time}</div>' +
				'   <a class="container-search-persons-item-link" target="_blank"' +
				'           title="' + me.translateText.link + '"' +
				'           href="' + Ext.manifest.hubApiEndpoint + '/pages/edit_subject/?subject={id}">' +
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
			data.bgcolor = Number(data.unchecked) ? '#f0f0f0' : data.bgcolor;
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
				'<ul class="container-search-persons-item-books">' +
				'<tpl for="arts">' +
				'<li class="container-search-persons-item-book" style="background-color: {bgcolor}">' +
				'   <a style="color: {link_color}" target="_blank" ' +
				'       href="' + Ext.manifest.hubApiEndpoint + '/pages/edit_object/?art={id}">{name}</a>' +
				'</li>' +
				'</tpl>' +
				'</ul>'
			);

			Ext.Array.each(
				data.arts,
				function (item)
				{
					item.bgcolor = 'white';
					item.bgcolor = Number(item.unchecked) ? '#f0f0f0' : item.bgcolor;
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