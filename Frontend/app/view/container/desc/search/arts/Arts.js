/**
 * Контейнер для отображения данных произведений.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.container.desc.search.arts.Arts',
	{
		extend: 'FBEditor.view.container.desc.search.Container',
		requires: [
			'FBEditor.view.container.desc.search.arts.ArtsController',
			'FBEditor.view.container.desc.search.arts.ArtsStore'
		],
		controller: 'container.desc.search.arts',
		xtype: 'container-desc-search-arts',
		cls: 'container-search-arts',

		translateText: {
			searching: 'Поиск произведений...',
			notFound: 'Ничего не найдено',
			author: 'Автор'
		},

		createStore: function ()
		{
			return Ext.create('FBEditor.view.container.desc.search.arts.ArtsStore');
		},

		load: function (data)
		{
			var me = this;

			me.maskSearching(false);
			me.fireEvent('afterLoad', data);

			if (data && data.length)
			{
				Ext.Array.each(
					data,
					function (item)
					{
						var art,
							artItems;

						if (item)
						{
							artItems = [
								{
									xtype: 'component',
									html: me.getHtmlItems(item),
									afterRender: function ()
									{
										me.afterRenderItem(this);
									}
								}
							];

							art = {
								xtype: 'container',
								width: '100%',
								cls: 'panel-arts-item',
								items: artItems
							};

							me.add(art);
						}
					}
				);
			}
			else
			{
				me.notFound();
			}

			me.doLayout();
		},

		/**
		 * @private
		 * Вызывается после добавления записи в контейнер.
		 * @param {Ext.Component} artCmp Компонент записи.
		 */
		afterRenderItem: function (artCmp)
		{
			var me = this,
				name;

			// добалвяем обработчик события при клике по названию
			name = artCmp.getEl().query('.panel-arts-item-name')[0];
			name.addEventListener(
				'click',
				function ()
				{
					var record,
						artId;

					artId = this.getAttribute('art-id');
					record = me.store.getRecord('id', artId);
					me.selectFn(record);
				}
			);
		},

		/**
		 * @private
		 * Возвращает html для отображения данных записи.
		 * @param {Object} data Данные записи.
		 * @return {String} Строка html.
		 */
		getHtmlItems: function (data)
		{
			var me = this,
				params = me.store.params || {},
				tpl,
				html;

			tpl = new Ext.XTemplate(
				'<div class="panel-arts-item-common " style="background-color: {bgcolor}">' +
				'   <tpl if="sale"><div class="panel-arts-item-sale"><span>$</span></div></tpl>' +
				'   <tpl if="type"><div class="panel-arts-item-type"><span>{type_code}</span></div></tpl>' +
				'   <div class="panel-arts-item-center">' +
				'       <div class="panel-arts-item-name" art-id="{id}">' +
				'           <a style="color: {link_color}" target="_blank" ' +
				'               href="https://hub.litres.ru/pages/edit_object/?art={id}">{name}</a>' +
				'       </div>' +
				'       <div class="panel-arts-item-author">{authors}</div>' +
				'       <div class="panel-arts-item-date">{registered}</div>' +
				'   </div>' +
				'</div>'
			);

			data.name = data.name ? data.name.replace(new RegExp('(' + params.q + ')', 'i'), '<b>$1</b>') : '';
			data.name = data.name.trim();

			data.bgcolor = 'white';
			data.bgcolor = Number(data.unchecked) ? '#f0f0f0' : data.bgcolor;

			data.link_color = '#2e7ed5';
			data.link_color = Number(data.unchecked) ? 'gray' : data.link_color;

			data.sale = Ext.Array.contains([0, 1, 4], Number(data.on_sale));
			data.type = data.type ? Number(data.type) : 0;

			switch (data.type)
			{
				case 1:
					data.type_code = '&#937;';
					break;
				case 2:
				case 6:
					data.type_code = '&#920;';
					break;
				case 4:
					data.type_code = '&#936;';
					break;
				case 11:
				case 12:
					data.type_code = '&#8471;';
					break;
				case 16:
					data.type_code = '&#9449;';
					break;
			}

			data.authors = '';
			Ext.Array.each(
				data.persons,
			    function (item)
			    {
				    data.authors += item.title + ' / ';
			    }
			);
			data.authors = data.authors.replace(/ \/ $/, '');

			html = tpl.apply(data);

			return html;
		}
	}
);