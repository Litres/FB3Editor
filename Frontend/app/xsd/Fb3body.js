/**
 * Схема XSD для тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.xsd.Fb3body',
	{
		/**
		 * Вовзращает xsd.
		 * @return {String} Строка xsd.
		 */
		getXsd: function ()
		{
			var xsd;

			xsd = '<?xml version="1.0" encoding="UTF-8"?>\
<schema xmlns:fb3b="http://www.fictionbook.org/FictionBook3/body" xmlns="http://www.w3.org/2001/XMLSchema"\
		xmlns:xlink="http://www.w3.org/1999/xlink" targetNamespace="http://www.fictionbook.org/FictionBook3/body"\
		elementFormDefault="qualified" attributeFormDefault="unqualified">\
	<element name="fb3-body">\
		<complexType>\
			<complexContent>\
				<extension base="fb3b:TitledType">\
					<sequence>\
						<element name="section" type="fb3b:SectionType" maxOccurs="unbounded"/>\
						<element name="notes" minOccurs="0" maxOccurs="unbounded">\
							<complexType>\
								<complexContent>\
									<extension base="fb3b:TitledType">\
										<sequence>\
											<element name="notebody" type="fb3b:SemiSimpleBodyType"\
											 maxOccurs="unbounded"/>\
										</sequence>\
										<attribute name="show"/>\
									</extension>\
								</complexContent>\
							</complexType>\
						</element>\
					</sequence>\
					<attribute name="id" type="fb3b:UUIDType" use="required"/>\
				</extension>\
			</complexContent>\
		</complexType>\
		<unique name="SectionID">\
			<selector xpath=".//section"/>\
			<field xpath="@id"/>\
		</unique>\
		<key name="SimpleNotesLinks">\
			<selector xpath=".//note"/>\
			<field xpath="@fb3b:href"/>\
		</key>\
		<keyref name="SimpleNotesTargets" refer="fb3b:SimpleNotesLinks">\
			<selector xpath="notes/note"/>\
			<field xpath="@id"/>\
		</keyref>\
	</element>\
	<complexType name="TitledType">\
		<sequence>\
			<element name="title" minOccurs="0">\
				<complexType>\
					<complexContent>\
						<extension base="fb3b:SimpleTextType"/>\
					</complexContent>\
				</complexType>\
			</element>\
			<element name="epigraph" minOccurs="0" maxOccurs="25">\
				<complexType>\
					<sequence>\
					    <choice>\
					        <element name="poem" type="fb3b:PoemType"/>\
				            <element name="p" type="fb3b:StyleType"/>\
				        </choice>\
				        <choice minOccurs="0" maxOccurs="unbounded">\
			                <element name="poem" type="fb3b:PoemType"/>\
			                <element name="p" type="fb3b:StyleType"/>\
			                <element name="br" type="fb3b:BRType"/>\
			            </choice>\
			            <element name="subscription" type="fb3b:BasicAnnotationType" minOccurs="0"/>\
			        </sequence>\
				</complexType>\
			</element>\
		</sequence>\
	</complexType>\
	<complexType name="SimpleTextType">\
		<sequence>\
			<element name="p" type="fb3b:StyleType"/>\
			<choice minOccurs="0" maxOccurs="unbounded">\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="br" type="fb3b:BRType"/>\
			</choice>\
			<element name="subscription" type="fb3b:BasicAnnotationType" minOccurs="0"></element>\
		</sequence>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="SectionType">\
		<complexContent>\
			<extension base="fb3b:TitledType">\
				<sequence>\
					<element name="annotation" type="fb3b:BasicAnnotationType" minOccurs="0"/>\
					<choice>\
						<element name="section" type="fb3b:SectionType" maxOccurs="unbounded"></element>\
						<sequence>\
							<choice maxOccurs="unbounded">\
								<element name="p" type="fb3b:StyleType"/>\
								<element name="subtitle" type="fb3b:StyleType"></element>\
								<element name="ol">\
									<complexType>\
										<complexContent>\
											<extension base="fb3b:LiHolderType"/>\
										</complexContent>\
									</complexType>\
								</element>\
								<element name="ul">\
									<complexType>\
										<complexContent>\
											<extension base="fb3b:LiHolderType"/>\
										</complexContent>\
									</complexType>\
								</element>\
								<element name="pre" type="fb3b:PHolderType"/>\
								<element name="table">\
									<complexType>\
										<complexContent>\
											<extension base="fb3b:TableType"/>\
										</complexContent>\
									</complexType>\
								</element>\
								<element name="poem">\
									<complexType>\
										<complexContent>\
											<extension base="fb3b:PoemType"/>\
										</complexContent>\
									</complexType>\
								</element>\
								<element name="blockquote" type="fb3b:PHolderType"/>\
								<element name="br" type="fb3b:BRType"/>\
								<element name="div" type="fb3b:DivBlockType"></element>\
							</choice>\
							<element name="subscription" type="fb3b:BasicAnnotationType" minOccurs="0"></element>\
						</sequence>\
						<element name="clipped"><complexType/></element>\
					</choice>\
				</sequence>\
				<attribute name="id" type="fb3b:UUIDType" use="required"/>\
				<attribute name="article" type="boolean" use="optional"/>\
				<attribute name="doi" type="fb3b:DOIType" use="optional"/>\
				<attribute name="clipped" type="boolean"/>\
				<attribute name="first-char-pos" type="positiveInteger"/>\
				<attribute name="output" type="fb3b:TrialShareType" default="default"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="DivBlockType">\
		<sequence>\
			<element name="title" type="fb3b:SimpleTextType" minOccurs="0"/>\
			<element name="marker" minOccurs="0">\
				<complexType>\
					<sequence>\
						<element name="img" type="fb3b:ImgType"/>\
					</sequence>\
				</complexType>\
			</element>\
			<choice>\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol" type="fb3b:LiHolderType"/>\
				<element name="ul" type="fb3b:LiHolderType"/>\
				<element name="pre" type="fb3b:PHolderType"/>\
				<element name="table" type="fb3b:TableType"/>\
				<element name="poem" type="fb3b:PoemType"/>\
				<element name="blockquote" type="fb3b:PHolderType"/>\
			</choice>\
			<choice minOccurs="0" maxOccurs="unbounded">\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol" type="fb3b:LiHolderType"/>\
				<element name="ul" type="fb3b:LiHolderType"/>\
				<element name="pre" type="fb3b:PHolderType"/>\
				<element name="table" type="fb3b:TableType"/>\
				<element name="poem" type="fb3b:PoemType"/>\
				<element name="blockquote" type="fb3b:PHolderType"/>\
				<element name="br" type="fb3b:BRType"/>\
			</choice>\
			<element name="subscription" type="fb3b:BasicAnnotationType" minOccurs="0"></element>\
		</sequence>\
		<attributeGroup ref="fb3b:SizingAttributes"/>\
		<attribute name="float" use="optional">\
			<simpleType>\
				<restriction base="token">\
					<enumeration value="left"/>\
					<enumeration value="right"/>\
					<enumeration value="center"/>\
					<enumeration value="default"/>\
				</restriction>\
			</simpleType>\
		</attribute>\
		<attribute name="align" type="fb3b:alignType" use="optional"/>\
		<attribute name="bindto" type="IDREF" use="optional"/>\
		<attribute name="border" type="boolean" use="optional"/>\
		<attribute name="id" type="ID" use="optional"/>\
		<attribute name="on-one-page" type="boolean" use="optional"/>\
	</complexType>\
	<complexType name="BasicAnnotationType">\
		<sequence>\
			<choice>\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol" type="fb3b:LiHolderType"/>\
				<element name="ul" type="fb3b:LiHolderType"/>\
				<element name="pre" type="fb3b:PHolderType"/>\
				<element name="blockquote" type="fb3b:PHolderType"/>\
			</choice>\
			<choice minOccurs="0" maxOccurs="unbounded">\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol" type="fb3b:LiHolderType"/>\
				<element name="ul" type="fb3b:LiHolderType"/>\
				<element name="pre" type="fb3b:PHolderType"/>\
				<element name="blockquote" type="fb3b:PHolderType"/>\
				<element name="br" type="fb3b:BRType"/>\
			</choice>\
		</sequence>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="BRType">\
		<attribute name="clear" type="fb3b:BrClearType" use="optional"/>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="TableType">\
		<complexContent>\
			<extension base="fb3b:TitledType">\
				<sequence>\
					<element name="tr" maxOccurs="unbounded">\
						<complexType>\
							<choice maxOccurs="unbounded">\
								<element name="th" type="fb3b:TDType"/>\
								<element name="td" type="fb3b:TDType"/>\
							</choice>\
							<attribute name="align" type="fb3b:alignType" use="optional" default="left"/>\
							<attribute name="id" type="ID" use="optional"/>\
						</complexType>\
					</element>\
				</sequence>\
				<attribute name="id" type="ID" use="optional"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="TDType">\
		<complexContent>\
			<extension base="fb3b:PHolderType">\
				<attribute name="colspan" type="integer" use="optional"/>\
				<attribute name="rowspan" type="integer" use="optional"/>\
				<attribute name="align" type="fb3b:alignType" use="optional" default="left"/>\
				<attribute name="valign" type="fb3b:vAlignType" use="optional" default="top"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="StyleType" mixed="true">\
		<choice minOccurs="0" maxOccurs="unbounded">\
			<element name="strong" type="fb3b:StyleType"></element>\
			<element name="em" type="fb3b:StyleType"></element>\
			<element name="strikethrough" type="fb3b:StyleType"></element>\
			<element name="sub" type="fb3b:StyleType"></element>\
			<element name="sup" type="fb3b:StyleType"></element>\
			<element name="code" type="fb3b:StyleType"></element>\
			<element name="underline" type="fb3b:StyleType"></element>\
			<element name="spacing" type="fb3b:StyleType"></element>\
			<element name="span">\
				<complexType mixed="true">\
					<complexContent mixed="true">\
						<extension base="fb3b:StyleType">\
							<attribute name="class" type="normalizedString" use="optional"/>\
						</extension>\
					</complexContent>\
				</complexType>\
			</element>\
			<element name="note" type="fb3b:NoteType"/>\
			<element name="a" type="fb3b:LinkType"/>\
			<element name="smallcaps" type="fb3b:StyleType"/>\
			<element name="img" type="fb3b:ImgType"/>\
			<element name="paper-page-break" type="fb3b:PaperPageBreakType"/>\
		</choice>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="StyleInLinkType" mixed="true">\
		<choice minOccurs="0" maxOccurs="unbounded">\
			<element name="strong" type="fb3b:StyleInLinkType"/>\
			<element name="em" type="fb3b:StyleInLinkType"/>\
			<element name="strikethrough" type="fb3b:StyleInLinkType"/>\
			<element name="sub" type="fb3b:StyleInLinkType"/>\
			<element name="sup" type="fb3b:StyleInLinkType"/>\
			<element name="code" type="fb3b:StyleInLinkType"/>\
			<element name="underline" type="fb3b:StyleInLinkType"/>\
			<element name="spacing" type="fb3b:StyleInLinkType"/>\
			<element name="span">\
				<complexType mixed="true">\
					<complexContent mixed="true">\
						<extension base="fb3b:StyleInLinkType">\
							<attribute name="class" type="normalizedString" use="optional"/>\
						</extension>\
					</complexContent>\
				</complexType>\
			</element>\
			<element name="smallcaps" type="fb3b:StyleType"/>\
			<element name="img" type="fb3b:ImgType"/>\
			<element name="paper-page-break" type="fb3b:PaperPageBreakType"/>\
		</choice>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="LinkType" mixed="true">\
		<complexContent mixed="true">\
			<extension base="fb3b:StyleInLinkType">\
				<attribute name="href" type="anyURI" use="required"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="NoteType" mixed="true">\
		<complexContent mixed="true">\
			<extension base="fb3b:StyleInLinkType">\
				<attribute name="href" type="IDREF" use="required"/>\
				<attribute name="role" use="optional" default="auto">\
					<simpleType>\
						<restriction base="token">\
							<enumeration value="auto"/>\
							<enumeration value="footnote"/>\
							<enumeration value="endnote"/>\
							<enumeration value="comment"/>\
							<enumeration value="other"/>\
						</restriction>\
					</simpleType>\
				</attribute>\
				<attribute name="autotext" default="1" use="optional">\
					<simpleType>\
						<restriction base="token">\
							<enumeration value="1"/>\
							<enumeration value="i"/>\
							<enumeration value="a"/>\
							<enumeration value="*"/>\
							<enumeration value="keep"/>\
						</restriction>\
					</simpleType>\
            	</attribute>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="ImgType">\
		<attribute name="src" type="anyURI" use="required"/>\
		<attribute name="alt" type="string" use="optional"/>\
		<attribute name="id" type="ID" use="optional"/>\
		<attributeGroup ref="fb3b:SizingAttributes"/>\
	</complexType>\
	<complexType name="PHolderType">\
		<complexContent>\
			<extension base="fb3b:TitledType">\
				<sequence maxOccurs="unbounded">\
					<element name="p" type="fb3b:StyleType"/>\
					<choice minOccurs="0" maxOccurs="unbounded">\
			            <element name="p" type="fb3b:StyleType"/>\
                        <element name="br" type="fb3b:BRType"/>\
                    </choice>\
					<element name="subscription" type="fb3b:BasicAnnotationType" minOccurs="0"/>\
				</sequence>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="LiHolderType">\
		<complexContent>\
			<extension base="fb3b:TitledType">\
				<sequence>\
					<element name="li" type="fb3b:StyleType"/>\
					<choice minOccurs="0" maxOccurs="unbounded">\
						<element name="li" type="fb3b:StyleType"/>\
						<element name="ol" type="fb3b:LiHolderType"/>\
						<element name="ul" type="fb3b:LiHolderType"/>\
					</choice>\
				</sequence>\
				<attribute name="id" type="ID" use="optional"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="PoemType">\
		<complexContent>\
			<extension base="fb3b:TitledType">\
				<sequence>\
					<element name="stanza" type="fb3b:PHolderType" maxOccurs="unbounded"/>\
					<element name="subscription" type="fb3b:BasicAnnotationType" minOccurs="0"/>\
				</sequence>\
				<attribute name="id" type="ID" use="optional"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="SemiSimpleBodyType">\
		<sequence>\
			<element name="title" type="fb3b:SimpleTextType" minOccurs="0"/>\
			<choice maxOccurs="unbounded">\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol">\
					<complexType>\
						<complexContent>\
							<extension base="fb3b:LiHolderType"/>\
						</complexContent>\
					</complexType>\
				</element>\
				<element name="ul">\
					<complexType>\
						<complexContent>\
							<extension base="fb3b:LiHolderType"/>\
						</complexContent>\
					</complexType>\
				</element>\
				<element name="pre" type="fb3b:PHolderType"/>\
				<element name="table" type="fb3b:TableType"/>\
				<element name="poem" type="fb3b:PoemType"/>\
				<element name="blockquote" type="fb3b:PHolderType"/>\
				<element name="br" type="fb3b:BRType"/>\
			</choice>\
		</sequence>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="PaperPageBreakType">\
		<attribute name="page-before" type="positiveInteger" use="required"/>\
		<attribute name="page-after" type="positiveInteger" use="optional"/>\
	</complexType>\
	<simpleType name="alignType">\
		<restriction base="token">\
			<enumeration value="left"/>\
			<enumeration value="right"/>\
			<enumeration value="center"/>\
			<enumeration value="justify"/>\
		</restriction>\
	</simpleType>\
	<simpleType name="vAlignType">\
		<restriction base="token">\
			<enumeration value="top"/>\
			<enumeration value="middle"/>\
			<enumeration value="bottom"/>\
		</restriction>\
	</simpleType>\
	<simpleType name="BrClearType">\
		<restriction base="token">\
			<enumeration value="left"/>\
			<enumeration value="right"/>\
			<enumeration value="both"/>\
			<enumeration value="page"/>\
		</restriction>\
	</simpleType>\
	<simpleType name="TrialShareType">\
		<restriction base="token">\
			<enumeration value="default"/>\
			<enumeration value="trial"/>\
			<enumeration value="trial-only"/>\
			<enumeration value="payed"/>\
		</restriction>\
	</simpleType>\
	<simpleType name="ScreenSizeType">\
		<restriction base="normalizedString">\
			<pattern value="\\\d+(\\.\\\d+)?(em|ex|%|mm)"/>\
		</restriction>\
	</simpleType>\
	<attributeGroup name="SizingAttributes">\
		<attribute name="width" type="fb3b:ScreenSizeType" use="optional"/>\
		<attribute name="min-width" type="fb3b:ScreenSizeType" use="optional"/>\
		<attribute name="max-width" type="fb3b:ScreenSizeType" use="optional"/>\
	</attributeGroup>\
	<simpleType name="UUIDType">\
		<restriction base="token">\
			<pattern value="[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}"/>\
		</restriction>\
	</simpleType>\
	<simpleType name="DOIType">\
        <restriction base="string">\
            <pattern value=\'(10[.][0-9]{3,})(\\.[0-9]+)*/[^"]([^"&amp;&lt;&gt;])+\'/>\
		</restriction>\
	</simpleType>\
	<attribute name="role" default="auto">\
		<simpleType>\
			<restriction base="token">\
				<enumeration value="auto"/>\
				<enumeration value="footnote"/>\
				<enumeration value="endnote"/>\
				<enumeration value="comment"/>\
				<enumeration value="other"/>\
			</restriction>\
		</simpleType>\
	</attribute>\
	<attribute name="href" type="anyURI"></attribute>\
</schema>';
			
			return xsd;
		}
	}
);