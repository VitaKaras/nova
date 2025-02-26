/* eslint-disable max-len */
import { IInfoMessage, IInfoMessageProperties, ILinkDefinition } from "../../components/types";
import { FormStackComponent } from "../../configurator/components/form-stack/form-stack.component";
import { WidgetConfiguratorSectionComponent } from "../../configurator/components/widget-configurator-section/widget-configurator-section.component";
import { EmbeddedContentConfigurationComponent } from "../../configurator/components/widgets/configurator-items/embedded-content-configuration/embedded-content-configuration.component";
import { InfoMessageConfigurationComponent } from "../../configurator/components/widgets/configurator-items/info-message-configuration/info-message-configuration.component";
import { TitleAndDescriptionConfigurationComponent } from "../../configurator/components/widgets/configurator-items/title-and-description-configuration/title-and-description-configuration.component";
import { IConverterFormPartsProperties } from "../../configurator/services/converters/types";
import { DEFAULT_PIZZAGNA_ROOT, NOVA_GENERIC_CONVERTER, NOVA_TITLE_AND_DESCRIPTION_CONVERTER } from "../../services/types";
import { IProviderConfiguration, PizzagnaLayer, WellKnownProviders } from "../../types";
/* eslint-enable max-len */

export const embeddedContentConfigurator = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
            // base layout of the configurator - all form components referenced herein will be stacked in a column
            componentType: FormStackComponent.lateLoadKey,
            properties: {
                elementClass: "flex-grow-1 overflow-auto nui-scroll-shadows",
                // references to other components laid out in this form
                nodes: [
                    "presentation",
                    "customConfig",
                ],
            },
        },
        // /presentation
        presentation: {
            id: "presentation",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: $localize`Presentation`,
                nodes: ["titleAndDescription"],
            },
        },
        // /presentation/titleAndDescription
        titleAndDescription: {
            id: "titleAndDescription",
            componentType: TitleAndDescriptionConfigurationComponent.lateLoadKey,
            providers: {
                converter: {
                    providerId: NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
                } as IProviderConfiguration,
            },
        },
        // /customConfig
        customConfig: {
            id: "customConfig",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: $localize`Custom Widget Configuration`,
                nodes: ["embeddedContentSelection"],
            },
        },
        // /customConfig/embeddedContentSelection
        embeddedContentSelection: {
            id: "embeddedContentSelection",
            componentType: EmbeddedContentConfigurationComponent.lateLoadKey,
            properties: {
                messageComponent: {
                    componentType: InfoMessageConfigurationComponent.lateLoadKey,
                    properties:  {
                        emphasizeText: "Some content may not work as expected.",
                        generalText: `Web pages embedded in a widget may not be able to open popup windows or may experience formatting problems.
                                    If you supply your own HTML, dangerous content like scripts will be removed.`,
                        link: {
                            href: "https://www.solarwinds.com/",
                            target: "_blank",
                            text: "Learn more about best practices for the HTML widget",
                        } as ILinkDefinition,
                        allowDismiss: true,
                    } as IInfoMessageProperties,
                } as IInfoMessage,
            },
            providers: {
                // converter transforms the data between the widget and the form
                [WellKnownProviders.Converter]: {
                providerId: NOVA_GENERIC_CONVERTER,
                    properties: {
                        formParts: [
                            {
                                previewPath: "mainContent.properties",
                                keys: [
                                    "customEmbeddedContent",
                                    "mode",
                                    "messageComponent",
                                    "sanitized",
                                ],
                            },
                        ] as IConverterFormPartsProperties[],
                    },
                } as IProviderConfiguration,
            },
        },
    },
};
