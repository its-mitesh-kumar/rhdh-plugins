/*
 * Copyright Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { HeaderIcon } from '../HeaderIconButtonComponent/HeaderIcon';

interface HeaderItemContentProps {
  icon?: string;
  label?: string;
  subLabel?: string;
  // styles?: React.CSSProperties; // Allow styles to be passed in
}

const HeaderItemContent: React.FC<HeaderItemContentProps> = ({
  icon,
  label,
  subLabel,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
    {icon && (
      <HeaderIcon
        icon={icon}
        styles={label ? { marginRight: '0.5rem', flexShrink: 0 } : {}}
      />
    )}
    <Box>
      {label && <Typography variant="body2">{label}</Typography>}
      {subLabel && (
        <Typography variant="caption" color="text.secondary">
          {subLabel}
        </Typography>
      )}
    </Box>
  </Box>
);

export default HeaderItemContent;
