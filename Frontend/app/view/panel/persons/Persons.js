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
		 * Вызывается при выборе персоны из списка.
		 * @param {Object} Данные персоны.
		 */
		selectFn: Ext.emptyFn,

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

			me.callParent(arguments);
		},

		/**
		 * Загружает данные персон в панель.
		 * @param {Array} data Данные персон.
		 */
		load: function (data)
		{
			var me = this;

			console.log('load', data);

			Ext.suspendLayouts();
			me.removeAll();

			if (data && data.length)
			{
				Ext.Array.each(
					data,
					function (item)
					{
						var person,
							personItems;

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
								personItems.push(
									{
										xtype: 'fieldset',
										title: 'Книги (' + item.arts.length + ')',
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

			Ext.resumeLayouts();
			me.doLayout();
		},

		/**
		 * Удаляет все данные персон.
		 */
		clean: function ()
		{
			var me = this;

			me.removeAll();
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
				'   <div class="panel-persons-item-creator" style="color: {link_color}">{creator_login}</div>' +
				'   <div class="panel-persons-item-desc">{description}</div>' +
				'   <div class="panel-persons-item-time">{last_action_time}</div>' +
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
				'<div class="panel-persons-item-books">' +
				'<tpl for="arts">' +
				'<div class="panel-persons-item-book" style="background-color: {bgcolor}">' +
				'   <a style="color: {link_color}" target="_blank" ' +
				'       href="https://hub.litres.ru/pages/edit_object/?art={id}">{name}</a>' +
				'</div>' +
				'</tpl>' +
			    '</div>'
			);

			Ext.Array.each(
				data.arts,
			    function (item)
			    {
				    item.bgcolor = 'white';
				    item.bgcolor = Number(item.unchecked) ? '#f8f8f8' : item.bgcolor;
				    item.bgcolor = Number(item.sell_open) ? '##FFFD9A' : item.bgcolor;

				    item.link_color = '#2e7ed5';
				    item.link_color = Number(data.unchecked) ? 'gray' : item.link_color;
			    }
			);

			html = tpl.apply(data);

			return html;
		}
	}
);