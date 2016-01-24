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
			notFound: 'Ничего не найдено'
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
				'   <div class="panel-arts-item-name" art-id="{id}">' +
				'       <a style="color: {link_color}" target="_blank" ' +
				'           href="https://hub.litres.ru/pages/edit_object/?art={id}">{name}</a>' +
				'   </div>' +
				'</div>'
			);

			data.name = data.name ? data.name.replace(new RegExp('(' + params.q + ')', 'i'), '<b>$1</b>') : '';
			data.name = data.name.trim();

			data.bgcolor = 'white';
			data.link_color = '#2e7ed5';

			html = tpl.apply(data);

			return html;
		}
	}
);